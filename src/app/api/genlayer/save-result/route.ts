import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { reviewId, triageResult: r } = await req.json();
    if (!reviewId || !r) return NextResponse.json({ ok: false });

    const supabase = createServiceRoleClient();
    const VALID = ["SELF_MONITOR", "ROUTINE_DOCTOR", "SOON_DOCTOR", "URGENT_CARE", "EMERGENCY"];
    const urgency = String(r.urgency_level || r.urgencyLevel || "ROUTINE_DOCTOR");
    const urgencyLevel = VALID.includes(urgency) ? urgency : "ROUTINE_DOCTOR";

    await supabase.from("triage_results").upsert({
      genlayer_review_id: reviewId,
      urgency_level: urgencyLevel,
      confidence: Number(r.confidence ?? 0.7),
      possible_condition_categories: r.possible_condition_categories || [],
      red_flags_present: Boolean(r.red_flags_present),
      red_flags: r.red_flags || [],
      summary: String(r.summary || ""),
      recommended_next_step: String(r.recommended_next_step || ""),
      self_care_general: r.self_care_general || [],
      what_to_monitor: r.what_to_monitor || [],
      questions_for_doctor: r.questions_for_doctor || [],
      not_diagnosis_notice: String(r.not_diagnosis_notice || "This is not a diagnosis. Please consult a qualified healthcare professional."),
      reasoning: String(r.reasoning || ""),
      raw_result: r,
      genlayer_tx: "",
      created_at: new Date().toISOString(),
    }, { onConflict: "genlayer_review_id" });

    await supabase.from("reviews").update({
      status: "reviewed",
      urgency_level: urgencyLevel,
      summary: String(r.summary || ""),
      red_flags_present: Boolean(r.red_flags_present),
      updated_at: new Date().toISOString(),
    }).eq("genlayer_review_id", reviewId);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("save-result error:", err);
    return NextResponse.json({ ok: false });
  }
}
