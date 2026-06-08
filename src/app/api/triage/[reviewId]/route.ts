import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  const { reviewId } = await params;
  const supabase = createServiceRoleClient();

  try {
    // Check review status first
    const { data: review } = await supabase
      .from("reviews")
      .select("*")
      .eq("genlayer_review_id", reviewId)
      .single();

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (review.status === "submitted" || review.status === "reviewing") {
      // Try GenLayer directly in case the result landed on-chain but Supabase wasn't updated
      const contractAddress = process.env.NEXT_PUBLIC_GENLAYER_CONTRACT_ADDRESS;
      if (contractAddress) {
        try {
          const { getGenLayerClient, getContractAddress } = await import("@/lib/genlayer/client");
          const client = getGenLayerClient();
          const contract = getContractAddress();
          const raw = await client.readContract({
            address: contract,
            functionName: "get_triage_result",
            args: [reviewId],
          });
          // readContract may return a string OR an already-parsed object
          const str = typeof raw === "string" ? raw.trim() : "";
          const isObj = raw !== null && typeof raw === "object";
          if ((str && str !== "null") || isObj) {
            const parsed: Record<string, unknown> = isObj
              ? raw as Record<string, unknown>
              : JSON.parse(str);
            // Back-fill Supabase so future reads are instant
            await supabase.from("triage_results").upsert({
              genlayer_review_id: reviewId,
              urgency_level: parsed.urgency_level || "ROUTINE_DOCTOR",
              confidence: parsed.confidence || 0.7,
              possible_condition_categories: parsed.possible_condition_categories || [],
              red_flags_present: parsed.red_flags_present || false,
              red_flags: parsed.red_flags || [],
              summary: parsed.summary || "",
              recommended_next_step: parsed.recommended_next_step || "",
              self_care_general: parsed.self_care_general || [],
              what_to_monitor: parsed.what_to_monitor || [],
              questions_for_doctor: parsed.questions_for_doctor || [],
              not_diagnosis_notice: parsed.not_diagnosis_notice || "This is not a diagnosis. Please consult a qualified healthcare professional.",
              reasoning: parsed.reasoning || "",
              raw_result: parsed,
              genlayer_tx: review.latest_genlayer_tx || "",
              created_at: new Date().toISOString(),
            }, { onConflict: "genlayer_review_id" });
            await supabase.from("reviews").update({ status: "reviewed", updated_at: new Date().toISOString() }).eq("genlayer_review_id", reviewId);
            return NextResponse.json({
              triageResult: {
                reviewId,
                urgencyLevel: parsed.urgency_level || "ROUTINE_DOCTOR",
                confidence: parsed.confidence || 0.7,
                possibleConditionCategories: parsed.possible_condition_categories || [],
                redFlagsPresent: parsed.red_flags_present || false,
                redFlags: parsed.red_flags || [],
                summary: parsed.summary || "",
                recommendedNextStep: parsed.recommended_next_step || "",
                selfCareGeneral: parsed.self_care_general || [],
                whatToMonitor: parsed.what_to_monitor || [],
                questionsForDoctor: parsed.questions_for_doctor || [],
                notDiagnosisNotice: parsed.not_diagnosis_notice || "This is not a diagnosis. Please consult a qualified healthcare professional.",
                reasoning: parsed.reasoning || "",
              },
              status: "reviewed",
              proof: {
                contractAddress: contract,
                methodName: "get_triage_result",
                txHash: review.latest_genlayer_tx || "",
                status: "confirmed",
                timestamp: new Date().toISOString(),
                reviewId,
              },
            });
          }
        } catch {
          // GenLayer read failed — fall through to "reviewing" response
        }
      }

      // Check how old this review is — if stuck for >10 min, mark unavailable
      const createdAt = review.created_at ? new Date(review.created_at).getTime() : 0;
      const ageMinutes = (Date.now() - createdAt) / 60000;
      if (ageMinutes > 10) {
        return NextResponse.json({
          status: "unavailable",
          error: "This review's AI result is no longer available. The contract may have failed during processing. Please submit a new review.",
        });
      }

      return NextResponse.json({ status: review.status });
    }

    // Get triage result
    const { data: triage } = await supabase
      .from("triage_results")
      .select("*")
      .eq("genlayer_review_id", reviewId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!triage) {
      // GenLayer source of truth fallback
      const contractAddress = process.env.NEXT_PUBLIC_GENLAYER_CONTRACT_ADDRESS;
      if (contractAddress) {
        try {
          const { getGenLayerClient, getContractAddress } = await import("@/lib/genlayer/client");
          const client = getGenLayerClient();
          const contract = getContractAddress();

          const isFollowUp =
            review.status === "follow_up_submitted" ||
            review.status === "follow_up_reviewed";

          let raw: unknown;
          let methodName = "get_triage_result";

          if (isFollowUp) {
            // Use the new follow-up view helpers
            const ids = await client.readContract({
              address: contract,
              functionName: "get_review_followup_ids",
              args: [reviewId],
            }) as string[];

            if (ids && ids.length > 0) {
              const latestId = ids[ids.length - 1];
              raw = await client.readContract({
                address: contract,
                functionName: "get_followup_result",
                args: [reviewId, latestId],
              });
              methodName = "get_followup_result";
            }
          } else {
            raw = await client.readContract({
              address: contract,
              functionName: "get_triage_result",
              args: [reviewId],
            });
          }

          if (raw) {
            const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
            return NextResponse.json({
              triageResult: parsed,
              status: "reviewed",
              proof: {
                contractAddress: contract,
                methodName,
                txHash: review.latest_genlayer_tx || "",
                status: "confirmed",
                timestamp: review.updated_at,
                reviewId,
              },
            });
          }
        } catch (err) {
          console.error("GenLayer read error:", err);
        }
      }
      return NextResponse.json({ status: "reviewing" });
    }

    const triageResult = {
      reviewId: triage.genlayer_review_id,
      urgencyLevel: triage.urgency_level,
      confidence: triage.confidence,
      possibleConditionCategories: triage.possible_condition_categories || [],
      redFlagsPresent: triage.red_flags_present,
      redFlags: triage.red_flags || [],
      summary: triage.summary,
      recommendedNextStep: triage.recommended_next_step,
      selfCareGeneral: triage.self_care_general || [],
      whatToMonitor: triage.what_to_monitor || [],
      questionsForDoctor: triage.questions_for_doctor || [],
      notDiagnosisNotice: triage.not_diagnosis_notice ||
        "This is not a diagnosis. Please consult a qualified healthcare professional.",
      reasoning: triage.reasoning,
    };

    return NextResponse.json({
      triageResult,
      status: "reviewed",
      proof: {
        contractAddress: process.env.NEXT_PUBLIC_GENLAYER_CONTRACT_ADDRESS || "",
        methodName: "submit_symptom_review",
        txHash: triage.genlayer_tx || review.latest_genlayer_tx || "",
        status: "confirmed",
        timestamp: triage.created_at,
        reviewId,
      },
    });
  } catch (err: unknown) {
    console.error("GET /api/triage error:", err);
    return NextResponse.json({ error: "Failed to fetch triage result" }, { status: 500 });
  }
}
