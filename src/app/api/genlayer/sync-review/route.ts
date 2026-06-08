import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

/**
 * Called by the frontend AFTER the user's wallet has already signed and
 * submitted the writeContract transaction. This route only reads the result
 * back once GenLayer's LLM has finished processing.
 *
 * Body: { reviewId, txHash, reviewType, walletAddress }
 */
export async function POST(req: NextRequest) {
  const supabase = createServiceRoleClient();

  try {
    const { reviewPayload, walletAddress, txHash, isFollowUp } = await req.json();
    const reviewId = reviewPayload.review_id;
    const contractAddress = process.env.NEXT_PUBLIC_GENLAYER_CONTRACT_ADDRESS;

    // Mark as reviewing
    await supabase
      .from("reviews")
      .update({ status: "reviewing", updated_at: new Date().toISOString() })
      .eq("genlayer_review_id", reviewId);

    let triageResult: Record<string, unknown>;
    let finalTxHash = txHash || "";

    if (contractAddress) {
      const { getGenLayerClient, getContractAddress } = await import("@/lib/genlayer/client");
      const client = getGenLayerClient();
      const contract = getContractAddress();

      // Poll readContract until the LLM result is ready (max 3 minutes)
      const MAX_ATTEMPTS = 36; // 36 × 5s = 3 min
      let raw: unknown = null;

      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        await new Promise((r) => setTimeout(r, 5000));
        try {
          if (isFollowUp) {
            const followupId = reviewPayload.followup_id || `${reviewId}_fu`;
            raw = await client.readContract({
              address: contract,
              functionName: "get_followup_result",
              args: [reviewId, followupId],
            });
          } else {
            raw = await client.readContract({
              address: contract,
              functionName: "get_triage_result",
              args: [reviewId],
            });
          }

          // readContract may return a string OR an already-parsed object
          const str = typeof raw === "string" ? raw.trim() : "";
          const isObj = raw !== null && typeof raw === "object";
          if ((str && str !== "null") || isObj) break;
          raw = null;
        } catch {
          // Not ready yet — keep polling
        }
      }

      if (!raw) {
        await supabase
          .from("reviews")
          .update({ status: "submitted", updated_at: new Date().toISOString() })
          .eq("genlayer_review_id", reviewId);
        return NextResponse.json({ error: "GenLayer triage timed out" }, { status: 504 });
      }

      triageResult = typeof raw === "string" ? JSON.parse(raw) : raw as Record<string, unknown>;

      // Also fetch safety flags and merge — these may override urgency to EMERGENCY
      try {
        const rawFlags = await client.readContract({
          address: contract,
          functionName: "get_safety_flags",
          args: [reviewId],
        });
        if (rawFlags) {
          const flags = typeof rawFlags === "string" ? JSON.parse(rawFlags) : rawFlags as Record<string, unknown>;
          if (flags && typeof flags === "object") {
            // If contract flagged emergency via red-flag detection, honour it
            if (flags.urgency_override === "EMERGENCY" || flags.red_flags_present) {
              triageResult = {
                ...triageResult,
                urgency_level: flags.urgency_override || triageResult.urgency_level,
                red_flags_present: true,
                red_flags: flags.red_flags || triageResult.red_flags,
                safety_message: flags.safety_message,
              };
            }
          }
        }
      } catch {
        // safety_flags may be empty for non-emergency reviews — not an error
      }
    } else {
      // Demo mode — no contract configured
      triageResult = buildDemoTriageResult(reviewPayload);
      finalTxHash = `0xdemo_${Date.now().toString(16)}`;
    }

    const normalised = normaliseTriageResult(reviewId, triageResult);

    await supabase.from("triage_results").insert({
      genlayer_review_id: reviewId,
      urgency_level: normalised.urgencyLevel,
      confidence: normalised.confidence,
      possible_condition_categories: normalised.possibleConditionCategories,
      red_flags_present: normalised.redFlagsPresent,
      red_flags: normalised.redFlags,
      summary: normalised.summary,
      recommended_next_step: normalised.recommendedNextStep,
      self_care_general: normalised.selfCareGeneral,
      what_to_monitor: normalised.whatToMonitor,
      questions_for_doctor: normalised.questionsForDoctor,
      not_diagnosis_notice: normalised.notDiagnosisNotice,
      reasoning: normalised.reasoning,
      raw_result: triageResult,
      genlayer_tx: finalTxHash,
      created_at: new Date().toISOString(),
    });

    await supabase
      .from("reviews")
      .update({
        status: "reviewed",
        urgency_level: normalised.urgencyLevel,
        summary: normalised.summary,
        red_flags_present: normalised.redFlagsPresent,
        latest_genlayer_tx: finalTxHash,
        updated_at: new Date().toISOString(),
      })
      .eq("genlayer_review_id", reviewId);

    await supabase
      .from("transactions")
      .update({
        status: "confirmed",
        tx_hash: finalTxHash,
        response_payload: triageResult,
        updated_at: new Date().toISOString(),
      })
      .eq("genlayer_review_id", reviewId)
      .eq("status", "pending");

    if (normalised.urgencyLevel === "EMERGENCY") {
      await supabase.from("safety_flags").insert({
        genlayer_review_id: reviewId,
        user_wallet: walletAddress || "0x0000",
        urgency_override: "EMERGENCY",
        red_flags: normalised.redFlags,
        safety_message: normalised.summary,
        genlayer_tx: finalTxHash,
        created_at: new Date().toISOString(),
      });
      await supabase
        .from("reviews")
        .update({ status: "flagged_emergency" })
        .eq("genlayer_review_id", reviewId);
      await supabase.from("notifications").insert({
        wallet_address: walletAddress || "0x0000",
        title: "⚠️ Emergency-Level Triage Result",
        body: "Your review returned an EMERGENCY urgency level. Seek emergency medical care immediately.",
        type: "emergency",
        created_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ ok: true, reviewId, urgencyLevel: normalised.urgencyLevel });
  } catch (err: unknown) {
    console.error("sync-review error:", err);
    return NextResponse.json({ error: "GenLayer sync failed" }, { status: 500 });
  }
}

// ── Demo mode ────────────────────────────────────────────────────────────────

function buildDemoTriageResult(payload: Record<string, unknown>): Record<string, unknown> {
  const reviewType = payload.review_type as string;
  const severity = Number(payload.severity || 5);
  const freeText = String(payload.free_text || "").toLowerCase();
  const symptoms = (payload.symptoms as string[] || []).map((s) => s.toLowerCase());

  const EMERGENCY_WORDS = ["chest pain", "can't breathe", "stroke", "unconscious", "seizure",
    "severe bleeding", "anaphylaxis", "suicidal", "collapse", "sepsis"];
  const isEmergency = EMERGENCY_WORDS.some(
    (w) => freeText.includes(w) || symptoms.some((s) => s.includes(w))
  );
  const isPregnancyOrChild = reviewType === "pregnancy_concern" || reviewType === "child_symptom";
  const highSeverity = severity >= 8;

  let urgencyLevel: string;
  if (isEmergency) urgencyLevel = "EMERGENCY";
  else if (highSeverity || (isPregnancyOrChild && severity >= 6)) urgencyLevel = "URGENT_CARE";
  else if (severity >= 6) urgencyLevel = "SOON_DOCTOR";
  else if (severity >= 4) urgencyLevel = "ROUTINE_DOCTOR";
  else urgencyLevel = "SELF_MONITOR";

  const conditionCategories: Record<string, string[]> = {
    symptom: ["upper respiratory infection", "viral illness", "bacterial infection"],
    report: ["metabolic condition", "inflammatory marker", "blood count abnormality"],
    medication_concern: ["adverse drug reaction", "drug interaction concern", "dosage concern"],
    child_symptom: ["pediatric viral infection", "febrile illness", "respiratory infection"],
    pregnancy_concern: ["pregnancy-related complication", "obstetric concern", "preeclampsia risk"],
    follow_up: ["symptom progression", "treatment response"],
  };

  return {
    review_id: payload.review_id,
    urgency_level: urgencyLevel,
    confidence: 0.72,
    possible_condition_categories: conditionCategories[reviewType] || ["unspecified condition"],
    red_flags_present: isEmergency || highSeverity,
    red_flags: isEmergency ? ["Emergency symptoms detected"] : [],
    summary: urgencyLevel === "EMERGENCY"
      ? "Emergency-level symptoms detected. Seek emergency medical care immediately."
      : `Triage level: ${urgencyLevel.replace(/_/g, " ")}. Professional medical review is recommended.`,
    recommended_next_step: urgencyLevel === "EMERGENCY" ? "Call emergency services immediately."
      : urgencyLevel === "URGENT_CARE" ? "Seek same-day urgent care today."
      : urgencyLevel === "SOON_DOCTOR" ? "See a doctor within 24–72 hours."
      : urgencyLevel === "ROUTINE_DOCTOR" ? "Book a routine appointment."
      : "Monitor symptoms. Seek care if they worsen.",
    self_care_general: ["Rest and stay hydrated", "Monitor temperature", "Avoid strenuous activity"],
    what_to_monitor: ["worsening symptoms", "new symptoms", "difficulty breathing", "high fever"],
    questions_for_doctor: [
      "What tests are appropriate?",
      "Are my current medications suitable?",
      "When should I return if symptoms worsen?",
    ],
    not_diagnosis_notice: "This is not a diagnosis. Please consult a qualified healthcare professional.",
    reasoning: `Assessment based on: review type (${reviewType}), severity (${severity}/10).`,
  };
}

function normaliseTriageResult(reviewId: string, raw: Record<string, unknown>) {
  const VALID = ["SELF_MONITOR", "ROUTINE_DOCTOR", "SOON_DOCTOR", "URGENT_CARE", "EMERGENCY"];
  const urgency = String(raw.urgency_level || raw.urgencyLevel || "ROUTINE_DOCTOR");
  return {
    reviewId,
    urgencyLevel: VALID.includes(urgency) ? urgency : "ROUTINE_DOCTOR",
    confidence: Number(raw.confidence || 0.7),
    possibleConditionCategories: (raw.possible_condition_categories as string[]) || [],
    redFlagsPresent: Boolean(raw.red_flags_present),
    redFlags: (raw.red_flags as string[]) || [],
    summary: String(raw.summary || ""),
    recommendedNextStep: String(raw.recommended_next_step || "Consult a healthcare professional."),
    selfCareGeneral: (raw.self_care_general as string[]) || [],
    whatToMonitor: (raw.what_to_monitor as string[]) || [],
    questionsForDoctor: (raw.questions_for_doctor as string[]) || [],
    notDiagnosisNotice: "This is not a diagnosis. Please consult a qualified healthcare professional.",
    reasoning: String(raw.reasoning || ""),
  };
}
