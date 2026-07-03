import { z } from "zod";

export const usernameRegex = /^[a-z0-9_]{3,24}$/;

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase().replace(/^@+/, "");
}

export function getPasswordChecks(password: string) {
  return {
    length: password.length >= 10,
    lower: /[a-z]/.test(password),
    upper: /[A-Z]/.test(password),
    number: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };
}

export function getPasswordStrength(password: string) {
  const checks = getPasswordChecks(password);
  return Object.values(checks).filter(Boolean).length;
}

export function isStrongPassword(password: string) {
  return getPasswordStrength(password) >= 5;
}

export const loginSchema = z.object({
  mode: z.literal("login"),
  email: z.string().trim().toLowerCase().email("Email tidak valid."),
  password: z.string().min(1, "Password wajib diisi."),
});

export const signupSchema = z.object({
  mode: z.literal("signup"),
  username: z.string().trim().transform(normalizeUsername).pipe(
    z.string().regex(usernameRegex, "Username 3-24 karakter, hanya huruf kecil, angka, dan underscore."),
  ),
  firstName: z.string().trim().min(2, "Nama pertama minimal 2 karakter.").max(50, "Nama pertama terlalu panjang."),
  lastName: z.string().trim().max(50, "Nama kedua terlalu panjang.").optional().default(""),
  email: z.string().trim().toLowerCase().email("Email tidak valid."),
  password: z.string().min(10, "Password minimal 10 karakter.").refine(isStrongPassword, "Password harus berisi huruf kecil, huruf besar, angka, dan simbol."),
  confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi."),
}).superRefine((value, ctx) => {
  if (value.password !== value.confirmPassword) {
    ctx.addIssue({
      code: "custom",
      path: ["confirmPassword"],
      message: "Konfirmasi password tidak sama.",
    });
  }
});

export const authPasswordSchema = z.discriminatedUnion("mode", [loginSchema, signupSchema]);

export function formatZodError(error: z.ZodError) {
  return error.issues[0]?.message || "Data auth tidak valid.";
}
