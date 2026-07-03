import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "../../../../lib/supabase/server";

function isMissingProfileColumn(error: unknown) {
  const value = error as { code?: string; message?: string; details?: string };
  const text = `${value?.code || ""} ${value?.message || ""} ${value?.details || ""}`.toLowerCase();
  return text.includes("42703") || text.includes("pgrst204") || text.includes("profiles.username") || text.includes("ai_credit_balance");
}

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData.user;

    if (userError || !user) {
      return NextResponse.json({ user: null });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("username,first_name,last_name,full_name,ai_credit_balance")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError && !isMissingProfileColumn(profileError)) {
      return NextResponse.json({ error: profileError.message }, { status: 502 });
    }

    const firstName = profile && "first_name" in profile ? profile.first_name : null;
    const lastName = profile && "last_name" in profile ? profile.last_name : null;
    const fullName = profile && "full_name" in profile ? profile.full_name : null;
    const name = fullName || [firstName, lastName].filter(Boolean).join(" ") || user.user_metadata?.full_name || null;

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name,
        username: profile && "username" in profile ? profile.username : null,
        aiCreditBalance: profile && "ai_credit_balance" in profile ? profile.ai_credit_balance || 0 : 0,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Profil gagal dimuat." }, { status: 500 });
  }
}