"use server";
import { setTokenCookie, storeUserData, clearAuthCookies, getTokenCookie } from "@/lib/cookies";
import { ENDPOINTS } from "@/lib/endpoints";

const API = "http://localhost:5000";

interface AuthApiResponse {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    user: { id: string; name: string; email: string; role: string; avatar?: string; provider: string };
  };
}

interface AuthUserRecord {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
  provider: "local" | "google";
}

async function persistAuth(data: NonNullable<AuthApiResponse["data"]>) {
  await setTokenCookie(data.token);
  await storeUserData(data.user);
  return data.user.role === "admin" ? "/admin" : "/shop";
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  try {
    const res = await fetch(`${API}${ENDPOINTS.AUTH.LOGIN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const result = (await res.json()) as AuthApiResponse;
    if (!res.ok || !result.data) return { success: false, message: result.message || "Login failed" };

    const redirectTo = await persistAuth(result.data);
    return { success: true, user: result.data.user, redirectTo };
  } catch {
    return { success: false, message: "Something went wrong." };
  }
}

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  try {
    const res = await fetch(`${API}${ENDPOINTS.AUTH.REGISTER}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const result = (await res.json()) as AuthApiResponse;
    if (!res.ok || !result.data) return { success: false, message: result.message || "Registration failed" };

    return { success: true, message: "Account created successfully." };
  } catch {
    return { success: false, message: "Something went wrong." };
  }
}

// Called after Google Identity Services returns an ID token client-side.
export async function googleLoginAction(idToken: string) {
  try {
    const res = await fetch(`${API}${ENDPOINTS.AUTH.GOOGLE}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
    const result = (await res.json()) as AuthApiResponse;
    if (!res.ok || !result.data) return { success: false, message: result.message || "Google sign-in failed" };

    const redirectTo = await persistAuth(result.data);
    return { success: true, user: result.data.user, redirectTo };
  } catch {
    return { success: false, message: "Something went wrong." };
  }
}

export async function logoutAction() {
  await clearAuthCookies();
  return { success: true };
}

export async function whoamiAction() {
  const token = await getTokenCookie();
  if (!token) return null;

  const res = await fetch(`${API}${ENDPOINTS.AUTH.WHOAMI}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { success: boolean; data: AuthUserRecord };
  return data.data;
}

export async function updateProfileAction(formData: FormData) {
  const token = await getTokenCookie();
  const res = await fetch(`${API}${ENDPOINTS.AUTH.UPDATE}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw new Error("Update failed");
  const data = (await res.json()) as { success: boolean; data: AuthUserRecord };

  await storeUserData({
    id: data.data._id,
    name: data.data.name,
    email: data.data.email,
    role: data.data.role,
    avatar: data.data.avatar,
    provider: data.data.provider,
  });

  return data.data;
}

// ----- Logged-in change-password OTP flow -----
export async function requestPasswordChangeAction(currentPassword: string) {
  const token = await getTokenCookie();
  try {
    const res = await fetch(`${API}${ENDPOINTS.AUTH.REQUEST_PASSWORD_CHANGE}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword }),
    });
    const result = (await res.json()) as { success?: boolean; message?: string };
    if (!res.ok) return { success: false, message: result.message || "Failed to send verification code" };
    return { success: true, message: result.message || "Code sent" };
  } catch {
    return { success: false, message: "Something went wrong." };
  }
}

export async function confirmPasswordChangeAction(data: { code: string; newPassword: string }) {
  const token = await getTokenCookie();
  try {
    const res = await fetch(`${API}${ENDPOINTS.AUTH.CONFIRM_PASSWORD_CHANGE}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = (await res.json()) as { success?: boolean; message?: string };
    if (!res.ok) return { success: false, message: result.message || "Failed to update password" };
    return { success: true, message: result.message || "Password updated successfully" };
  } catch {
    return { success: false, message: "Something went wrong." };
  }
}

// ----- Logged-out forgot-password OTP flow -----
export async function forgotPasswordRequestAction(email: string) {
  try {
    const res = await fetch(`${API}${ENDPOINTS.AUTH.FORGOT_PASSWORD_REQUEST}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const result = (await res.json()) as { success?: boolean; message?: string };
    if (!res.ok) return { success: false, message: result.message || "Failed to send code" };
    return { success: true, message: result.message || "Code sent" };
  } catch {
    return { success: false, message: "Something went wrong." };
  }
}

export async function forgotPasswordVerifyAction(email: string, code: string) {
  try {
    const res = await fetch(`${API}${ENDPOINTS.AUTH.FORGOT_PASSWORD_VERIFY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const result = (await res.json()) as { success?: boolean; message?: string };
    if (!res.ok) return { success: false, message: result.message || "Invalid or expired code" };
    return { success: true, message: result.message || "Code verified" };
  } catch {
    return { success: false, message: "Something went wrong." };
  }
}

export async function forgotPasswordResetAction(email: string, code: string, newPassword: string) {
  try {
    const res = await fetch(`${API}${ENDPOINTS.AUTH.FORGOT_PASSWORD_RESET}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, newPassword }),
    });
    const result = (await res.json()) as { success?: boolean; message?: string };
    if (!res.ok) return { success: false, message: result.message || "Failed to reset password" };
    return { success: true, message: result.message || "Password reset successfully" };
  } catch {
    return { success: false, message: "Something went wrong." };
  }
}