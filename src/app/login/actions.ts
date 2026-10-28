"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { mapAuthError } from "@/lib/authErrors";

// Only allow redirecting back to an internal path (never "//host" or an absolute URL)
// so the "next" param from the query string can't be used for an open redirect.
function safeNextPath(next: FormDataEntryValue | null): string {
  const value = typeof next === "string" ? next : "";
  return value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

async function siteOrigin() {
  const h = await headers();
  return h.get("origin") ?? `https://${h.get("host")}`;
}

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = (formData.get("email") as string).trim().toLowerCase();
  const password = formData.get("password") as string;
  const next = safeNextPath(formData.get("next"));

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/login?error=${encodeURIComponent(mapAuthError(error.message))}&next=${encodeURIComponent(next)}`);
  }
  redirect(next);
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = (formData.get("email") as string).trim().toLowerCase();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password !== confirmPassword) {
    redirect(`/signup?error=${encodeURIComponent("Mật khẩu nhập lại không khớp.")}&email=${encodeURIComponent(email)}`);
  }

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    redirect(`/signup?error=${encodeURIComponent(mapAuthError(error.message))}&email=${encodeURIComponent(email)}`);
  }
  redirect(
    `/login?message=${encodeURIComponent("Đã tạo tài khoản. Kiểm tra email để xác nhận rồi đăng nhập.")}&email=${encodeURIComponent(email)}`,
  );
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient();
  const email = (formData.get("email") as string).trim().toLowerCase();
  const origin = await siteOrigin();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });
  if (error) {
    redirect(`/forgot-password?error=${encodeURIComponent(mapAuthError(error.message))}&email=${encodeURIComponent(email)}`);
  }
  redirect(
    `/forgot-password?message=${encodeURIComponent("Nếu email tồn tại, một liên kết đặt lại mật khẩu đã được gửi tới hộp thư của bạn.")}`,
  );
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password !== confirmPassword) {
    redirect(`/reset-password?error=${encodeURIComponent("Mật khẩu nhập lại không khớp.")}`);
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    redirect(`/reset-password?error=${encodeURIComponent(mapAuthError(error.message))}`);
  }
  redirect(`/login?message=${encodeURIComponent("Đã đổi mật khẩu thành công. Hãy đăng nhập lại.")}`);
}
