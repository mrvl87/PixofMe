import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "../../../lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData.user;

    if (userError || !user) {
      return NextResponse.json({ error: "Login dibutuhkan." }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("ai_credit_balance")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 502 });
    }

    const { data: ledger, error: ledgerError } = await supabase
      .from("ai_credit_ledger")
      .select("id,source_type,delta,balance_after,notes,created_at")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false })
      .limit(30);

    if (ledgerError) {
      return NextResponse.json({ error: ledgerError.message }, { status: 502 });
    }

    return NextResponse.json({ balance: profile?.ai_credit_balance || 0, ledger: ledger || [] });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Data kredit gagal dimuat." }, { status: 500 });
  }
}