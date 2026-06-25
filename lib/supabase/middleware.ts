import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabasePublicEnv, hasSupabasePublicEnv, isAuthGuardEnabled } from "../env";
import type { Database } from "./database.types";

const protectedPrefixes = ["/workspace.html", "/wizard-step1.html", "/wizard-step2.html", "/wizard-step3.html", "/wizard-step4.html"];

function isProtectedPath(pathname: string) {
  return protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!hasSupabasePublicEnv()) {
    return response;
  }

  const { url, publishableKey } = getSupabasePublicEnv();
  const supabase = createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  if (isAuthGuardEnabled() && !user && isProtectedPath(request.nextUrl.pathname)) {
    const urlToRedirect = request.nextUrl.clone();
    urlToRedirect.pathname = "/login.html";
    urlToRedirect.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(urlToRedirect);
  }

  return response;
}
