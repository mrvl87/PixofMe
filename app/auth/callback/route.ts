import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

function isMissingProfileColumn(error: unknown) {
  const value = error as { code?: string; message?: string; details?: string };
  const text = `${value?.code || ""} ${value?.message || ""} ${value?.details || ""}`.toLowerCase();
  return text.includes("42703") || text.includes("pgrst204") || text.includes("profiles.username") || text.includes("email_verified_at") || text.includes("first_name") || text.includes("last_name");
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/workspace.html";

  if (code) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.exchangeCodeForSession(code);
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (user) {
      const metadata = user.user_metadata || {};
      const firstName = typeof metadata.first_name === "string" ? metadata.first_name : null;
      const lastName = typeof metadata.last_name === "string" ? metadata.last_name : null;
      const fullName = typeof metadata.full_name === "string" ? metadata.full_name : [firstName, lastName].filter(Boolean).join(" ") || null;
      const username = typeof metadata.username === "string" ? metadata.username : null;

      const fullProfile = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          email: user.email || null,
          username,
          first_name: firstName,
          last_name: lastName,
          full_name: fullName,
          email_verified_at: user.email_confirmed_at || user.confirmed_at || new Date().toISOString(),
        }, { onConflict: "id" });

      if (fullProfile.error && isMissingProfileColumn(fullProfile.error)) {
        await supabase
          .from("profiles")
          .upsert({
            id: user.id,
            email: user.email || null,
            full_name: fullName,
          }, { onConflict: "id" });
      }
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
