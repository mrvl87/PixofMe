import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

import { authPasswordSchema, formatZodError } from "../../../../lib/auth/password";
import { checkAuthRateLimit, getClientIp } from "../../../../lib/auth/rate-limit";
import { createSupabaseServerClient, createSupabaseServiceRoleClient } from "../../../../lib/supabase/server";
import type { Database } from "../../../../lib/supabase/database.types";

type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];

function jsonError(message: string, status: number, code?: string) {
  return NextResponse.json({ error: message, code }, { status });
}

function authErrorMessage(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("already") || lower.includes("registered") || lower.includes("exists")) return "Email sudah digunakan.";
  if (lower.includes("invalid login") || lower.includes("invalid credentials")) return "Email atau password salah.";
  if (lower.includes("email not confirmed")) return "Email belum diverifikasi. Cek inbox email Anda.";
  return message;
}

function isMissingProfileColumn(error: unknown) {
  const value = error as { code?: string; message?: string; details?: string };
  const text = `${value?.code || ""} ${value?.message || ""} ${value?.details || ""}`.toLowerCase();
  return text.includes("42703") || text.includes("pgrst204") || text.includes("profiles.username") || text.includes("username column") || text.includes("email_verified_at") || text.includes("first_name") || text.includes("last_name");
}

async function ensureProfile(admin: SupabaseClient<Database>, profile: ProfileInsert) {
  const { error } = await admin
    .from("profiles")
    .upsert(profile, { onConflict: "id" });

  if (!error) return { profileSchemaReady: true };
  if (!isMissingProfileColumn(error)) throw new Error(error.message);

  const fallbackProfile: ProfileInsert = {
    id: profile.id,
    email: profile.email,
    full_name: profile.full_name,
  };
  const fallback = await admin
    .from("profiles")
    .upsert(fallbackProfile, { onConflict: "id" });

  if (fallback.error) throw new Error(fallback.error.message);
  return { profileSchemaReady: false };
}

async function usernameExists(admin: SupabaseClient<Database>, username: string) {
  const { data, error } = await admin
    .from("profiles")
    .select("id")
    .eq("username", username)
    .limit(1);

  if (!error) return Boolean(data?.length);
  if (isMissingProfileColumn(error)) return false;
  throw new Error(error.message);
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.json().catch(() => ({}));
    const parsed = authPasswordSchema.safeParse(rawBody);

    if (!parsed.success) {
      return jsonError(formatZodError(parsed.error), 400, "VALIDATION_ERROR");
    }

    const clientIp = getClientIp(request.headers);
    const rate = checkAuthRateLimit(`${parsed.data.mode}:${clientIp}:${parsed.data.email}`, parsed.data.mode === "signup" ? 5 : 10);
    if (!rate.allowed) {
      return jsonError("Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.", 429, "RATE_LIMITED");
    }

    const supabase = await createSupabaseServerClient();

    if (parsed.data.mode === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });

      if (error) return jsonError(authErrorMessage(error.message), 401, "LOGIN_FAILED");
      if (!data.user?.email_confirmed_at && !data.user?.confirmed_at) {
        await supabase.auth.signOut();
        return jsonError("Email belum diverifikasi. Cek inbox email Anda.", 403, "EMAIL_NOT_VERIFIED");
      }

      return NextResponse.json({
        ok: true,
        needsEmailConfirmation: false,
        user: data.user ? { id: data.user.id, email: data.user.email } : null,
      });
    }

    const admin = createSupabaseServiceRoleClient();

    if (await usernameExists(admin, parsed.data.username)) {
      return jsonError("Username sudah digunakan.", 409, "USERNAME_EXISTS");
    }

    const { data: emailRows, error: emailError } = await admin
      .from("profiles")
      .select("id")
      .eq("email", parsed.data.email)
      .limit(1);

    if (emailError) return jsonError(emailError.message, 502, "PROFILE_LOOKUP_FAILED");
    if (emailRows?.length) return jsonError("Email sudah digunakan.", 409, "EMAIL_EXISTS");

    const requestUrl = new URL(request.url);
    const emailRedirectTo = new URL("/auth/callback", requestUrl.origin);
    emailRedirectTo.searchParams.set("next", "/workspace.html");
    const fullName = [parsed.data.firstName, parsed.data.lastName].filter(Boolean).join(" ");

    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: emailRedirectTo.toString(),
        data: {
          username: parsed.data.username,
          first_name: parsed.data.firstName,
          last_name: parsed.data.lastName,
          full_name: fullName,
        },
      },
    });

    if (error) return jsonError(authErrorMessage(error.message), 409, "SIGNUP_FAILED");

    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      return jsonError("Email sudah digunakan.", 409, "EMAIL_EXISTS");
    }

    let profileSchemaReady = true;
    if (data.user) {
      const profileResult = await ensureProfile(admin, {
        id: data.user.id,
        email: parsed.data.email,
        username: parsed.data.username,
        first_name: parsed.data.firstName,
        last_name: parsed.data.lastName || null,
        full_name: fullName,
        email_verified_at: data.user.email_confirmed_at || data.user.confirmed_at || null,
      });
      profileSchemaReady = profileResult.profileSchemaReady;
    }

    if (data.session) {
      await supabase.auth.signOut();
    }

    return NextResponse.json({
      ok: true,
      needsEmailConfirmation: true,
      profileSchemaReady,
      schemaWarning: profileSchemaReady ? null : "Schema profiles belum punya kolom username/nama. Jalankan docs/SUPABASE_SCHEMA.sql agar username unik aktif penuh.",
      user: data.user ? { id: data.user.id, email: data.user.email } : null,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return jsonError(formatZodError(error), 400, "VALIDATION_ERROR");
    return jsonError(error instanceof Error ? error.message : "Auth gagal.", 500, "AUTH_FAILED");
  }
}
