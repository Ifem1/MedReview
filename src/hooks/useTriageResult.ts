"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { TriageResult, GenLayerProof } from "@/types/medreview";

const CONTRACT = process.env.NEXT_PUBLIC_GENLAYER_CONTRACT_ADDRESS as `0x${string}`;
const MAX_POLLS = 48; // 48 × 5s = 4 min
const POLL_INTERVAL = 5000;

function parseResult(raw: unknown): Record<string, unknown> | null {
  if (!raw) return null;
  if (typeof raw === "object") return raw as Record<string, unknown>;
  if (typeof raw === "string") {
    const s = raw.trim();
    if (!s || s === "null" || s === "") return null;
    try { return JSON.parse(s); } catch { return { raw_result: s }; }
  }
  return null;
}

function normalise(reviewId: string, r: Record<string, unknown>): TriageResult {
  const VALID = ["SELF_MONITOR", "ROUTINE_DOCTOR", "SOON_DOCTOR", "URGENT_CARE", "EMERGENCY"];
  // Handle non-JSON contract result (e.g. "undetermined")
  if (r.raw_result && !r.urgency_level && !r.urgencyLevel) {
    const raw = String(r.raw_result).toLowerCase();
    return {
      reviewId,
      urgencyLevel: "ROUTINE_DOCTOR",
      confidence: 0,
      possibleConditionCategories: [],
      redFlagsPresent: false,
      redFlags: [],
      summary: raw === "undetermined"
        ? "The AI could not determine a result for this review. This may be due to insufficient information or an ambiguous presentation. Please consult a healthcare professional."
        : `The contract returned an unexpected result: "${r.raw_result}". Please consult a healthcare professional.`,
      recommendedNextStep: "Please consult a qualified healthcare professional for a proper assessment.",
      selfCareGeneral: [],
      whatToMonitor: [],
      questionsForDoctor: [],
      notDiagnosisNotice: "This is not a diagnosis. Please consult a qualified healthcare professional.",
      reasoning: "",
    };
  }
  const urgency = String(r.urgency_level || r.urgencyLevel || "ROUTINE_DOCTOR");
  return {
    reviewId,
    urgencyLevel: (VALID.includes(urgency) ? urgency : "ROUTINE_DOCTOR") as TriageResult["urgencyLevel"],
    confidence: Number(r.confidence ?? 0.7),
    possibleConditionCategories: (r.possible_condition_categories as string[]) || [],
    redFlagsPresent: Boolean(r.red_flags_present),
    redFlags: (r.red_flags as string[]) || [],
    summary: String(r.summary || ""),
    recommendedNextStep: String(r.recommended_next_step || "Consult a healthcare professional."),
    selfCareGeneral: (r.self_care_general as string[]) || [],
    whatToMonitor: (r.what_to_monitor as string[]) || [],
    questionsForDoctor: (r.questions_for_doctor as string[]) || [],
    notDiagnosisNotice: String(r.not_diagnosis_notice || "This is not a diagnosis. Please consult a qualified healthcare professional."),
    reasoning: String(r.reasoning || ""),
  };
}

export function useTriageResult(reviewId: string | undefined) {
  const [result, setResult]   = useState<TriageResult | null>(null);
  const [proof, setProof]     = useState<Partial<GenLayerProof>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const pollCount = useRef(0);
  const timer     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stopped   = useRef(false);

  useEffect(() => {
    if (!reviewId) return;
    stopped.current = false;
    pollCount.current = 0;

    async function poll() {
      if (stopped.current) return;

      let apiSaidUnavailable = false;

      // 1. Try Supabase first (fastest if sync-review already saved it)
      try {
        const res = await fetch(`/api/triage/${reviewId}`);
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          const data = await res.json();
          if (data.status === "unavailable") {
            // Don't error yet — GenLayer may still have the result. Fall through.
            apiSaidUnavailable = true;
          } else if (data.triageResult) {
            setResult(data.triageResult);
            setProof(data.proof || {});
            setLoading(false);
            return;
          }
        }
      } catch { /* fall through to GenLayer direct read */ }

      // 2. Always try reading directly from GenLayer (browser transport works reliably)
      if (CONTRACT) {
        try {
          const client = createClient({ chain: studionet });
          const raw = await client.readContract({
            address: CONTRACT,
            functionName: "get_triage_result",
            args: [reviewId],
          });
          const parsed = parseResult(raw);
          if (parsed) {
            const triage = normalise(reviewId, parsed);
            setResult(triage);
            setProof({
              contractAddress: CONTRACT,
              methodName: "get_triage_result",
              txHash: "",
              status: "confirmed",
              timestamp: new Date().toISOString(),
              reviewId,
            });
            setLoading(false);

            // Save to Supabase so dashboard/history reflects this result
            fetch("/api/genlayer/save-result", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reviewId, triageResult: parsed }),
            }).catch(() => {});
            return;
          }
        } catch (e) {
          console.warn("[MedReview] GenLayer readContract failed:", e);
        }
      }

      // 3. If Supabase said unavailable AND GenLayer has nothing — show error
      if (apiSaidUnavailable) {
        setError("This review's result could not be retrieved. Please submit a new review.");
        setLoading(false);
        return;
      }

      // 4. Not ready yet — retry
      if (pollCount.current >= MAX_POLLS) {
        setError("GenLayer triage is taking longer than expected. The AI review may still be in progress — please refresh in a minute.");
        setLoading(false);
        return;
      }
      pollCount.current += 1;
      if (!stopped.current) {
        timer.current = setTimeout(poll, POLL_INTERVAL);
      }
    }

    poll();

    return () => {
      stopped.current = true;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [reviewId]);

  function retry() {
    stopped.current = false;
    pollCount.current = 0;
    setLoading(true);
    setError("");
    setResult(null);
  }

  return { result, proof, loading, error, retry };
}
