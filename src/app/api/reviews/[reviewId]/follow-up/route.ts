import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  const { reviewId } = await params;
  try {
    const { followupPayload, walletAddress } = await req.json();

    const supabase = createServiceRoleClient();

    await supabase.from("followups").insert({
      genlayer_followup_id: followupPayload.followup_id,
      genlayer_review_id: reviewId,
      user_wallet: walletAddress || "0x0000",
      symptom_change: followupPayload.symptom_change,
      current_severity: followupPayload.current_severity,
      new_symptoms: followupPayload.new_symptoms,
      resolved_symptoms: followupPayload.resolved_symptoms,
      free_text: followupPayload.free_text,
      created_at: new Date().toISOString(),
    });

    // Update review status
    await supabase
      .from("reviews")
      .update({ status: "follow_up_submitted", updated_at: new Date().toISOString() })
      .eq("genlayer_review_id", reviewId);

    // Trigger async GenLayer follow-up processing
    fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/genlayer/sync-review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reviewPayload: { ...followupPayload, review_type: "follow_up", review_id: reviewId },
        walletAddress,
        isFollowUp: true,
      }),
    }).catch(() => {});

    return NextResponse.json({ reviewId, followupId: followupPayload.followup_id, status: "submitted" });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
