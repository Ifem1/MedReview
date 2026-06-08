import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { wallet, notificationId } = await req.json();
  if (!wallet) return NextResponse.json({ error: "wallet required" }, { status: 400 });

  const supabase = createServiceRoleClient();
  const query = supabase.from("notifications").update({ read: true });

  if (notificationId) {
    await query.eq("id", notificationId).eq("wallet_address", wallet);
  } else {
    await query.eq("wallet_address", wallet);
  }

  return NextResponse.json({ ok: true });
}
