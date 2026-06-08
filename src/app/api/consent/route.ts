import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { wallet } = await req.json();
  if (!wallet) return NextResponse.json({ error: "wallet required" }, { status: 400 });

  const supabase = createServiceRoleClient();
  await supabase.from("profiles").upsert(
    {
      wallet_address: wallet,
      consent_accepted: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "wallet_address" }
  );

  return NextResponse.json({ ok: true });
}
