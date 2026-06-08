import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { reviewPayload, walletAddress } = await req.json();

    if (!reviewPayload?.review_id) {
      return NextResponse.json({ error: "Invalid review payload" }, { status: 400 });
    }

    const supabase = createServiceRoleClient();

    // Upsert profile
    if (walletAddress) {
      await supabase.from("profiles").upsert(
        { wallet_address: walletAddress, updated_at: new Date().toISOString() },
        { onConflict: "wallet_address" }
      );
    }

    // Index in Supabase (off-chain cache)
    const { error: insertErr } = await supabase.from("reviews").insert({
      genlayer_review_id: reviewPayload.review_id,
      user_wallet: walletAddress || "0x0000",
      review_type: reviewPayload.review_type,
      title: reviewPayload.title || "Review",
      status: "submitted",
      red_flags_present: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (insertErr && !insertErr.message.includes("duplicate")) {
      console.error("Supabase insert error:", insertErr.message);
      return NextResponse.json(
        { error: `Database error: ${insertErr.message}` },
        { status: 500 }
      );
    }

    // Record pending transaction
    await supabase.from("transactions").insert({
      wallet_address: walletAddress || "0x0000",
      genlayer_review_id: reviewPayload.review_id,
      action: `submit_${reviewPayload.review_type}`,
      status: "pending",
      request_payload: reviewPayload,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // sync-review is triggered by the frontend AFTER MetaMask signs the tx
    // Do NOT trigger it here — the tx hasn't been signed yet at this point

    return NextResponse.json({ reviewId: reviewPayload.review_id, status: "submitted" });
  } catch (err: unknown) {
    console.error("POST /api/reviews error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet");
  if (!wallet) return NextResponse.json({ error: "wallet required" }, { status: 400 });

  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("user_wallet", wallet)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ reviews: data || [] });
  } catch {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
