import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { DashboardStats, ReviewRow, UrgencyLevel } from "@/types/medreview";

const FAILED_STATUSES = new Set(["submitted", "reviewing"]);
const TEN_MINUTES = 10 * 60 * 1000;

function isFailedReview(r: ReviewRow): boolean {
  if (!FAILED_STATUSES.has(r.status)) return false;
  if (r.urgency_level) return false; // has a result — not failed
  const age = Date.now() - new Date(r.created_at).getTime();
  return age > TEN_MINUTES;
}

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet");
  if (!wallet) return NextResponse.json({ error: "wallet required" }, { status: 400 });

  try {
    const supabase = createServiceRoleClient();

    const [{ data: reviews, error }, { count: followupCount }] = await Promise.all([
      supabase.from("reviews").select("*").eq("user_wallet", wallet).order("created_at", { ascending: false }),
      supabase.from("followups").select("*", { count: "exact", head: true }).eq("user_wallet", wallet),
    ]);

    if (error) throw error;

    const all = (reviews || []) as ReviewRow[];
    const valid = all.filter((r) => !isFailedReview(r));
    const failedCount = all.length - valid.length;

    const reviewed = valid.filter((r) =>
      ["reviewed", "follow_up_reviewed", "flagged_emergency", "archived"].includes(r.status)
    );

    const latestReviewed = reviewed[0] ?? valid[0] ?? null;

    const stats: DashboardStats = {
      totalReviews: valid.length,
      latestUrgencyLevel: (latestReviewed?.urgency_level as UrgencyLevel | null) || null,
      openFollowUps: followupCount ?? valid.filter((r) => r.status === "follow_up_submitted").length,
      emergencyFlags: valid.filter(
        (r) => r.status === "flagged_emergency" || r.urgency_level === "EMERGENCY"
      ).length,
      reportReviews: valid.filter((r) => r.review_type === "report").length,
      symptomReviews: valid.filter((r) => r.review_type === "symptom").length,
    };

    return NextResponse.json({ reviews: valid, stats, failedCount });
  } catch {
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}
