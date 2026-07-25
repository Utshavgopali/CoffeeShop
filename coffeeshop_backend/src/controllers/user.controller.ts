import type { Request, Response } from "express";
import {
  registerService,
  loginService,
  getMeService,
  updateProfileService,
  changePasswordService,
} from "../services/user.service";
import {
  RegisterSchema,
  LoginSchema,
  UpdateProfileSchema,
  ChangePasswordSchema,
} from "../types/user.type";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
};

// Helper: empty strings from multipart forms should be treated as absent.
const clean = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

// POST /api/auth/register
export async function register(req: Request, res: Response) {
  try {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.issues[0]?.message ?? "Validation failed", errors: parsed.error.issues });
      return;
    }
    const result = await registerService(parsed.data);
    res.cookie("token", result.token, COOKIE_OPTS);
    res.status(201).json({ success: true, message: "Account created successfully", data: result });
  } catch (error: unknown) {
    const err = error as any;
    res.status(err.status ?? 400).json({ message: err.message ?? "Something went wrong" });
  }
}

// POST /api/auth/login
export async function login(req: Request, res: Response) {
  try {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.issues[0]?.message ?? "Validation failed", errors: parsed.error.issues });
      return;
    }
    const result = await loginService(parsed.data);
    res.cookie("token", result.token, COOKIE_OPTS);
    res.status(200).json({ success: true, message: "Logged in successfully", data: result });
  } catch (error: unknown) {
    const err = error as any;
    res.status(err.status ?? 400).json({ message: err.message ?? "Something went wrong" });
  }
}

// POST /api/auth/logout  (protected)
export async function logout(_req: Request, res: Response) {
  res.clearCookie("token", { ...COOKIE_OPTS, maxAge: undefined });
  res.status(200).json({ success: true, message: "Logged out" });
}

// GET /api/auth/whoami  (protected)
export async function getMe(req: Request, res: Response) {
  try {
    const userId = (req as any).userId as string;
    const user = await getMeService(userId);
    if (!user) { res.status(404).json({ message: "User not found" }); return; }
    res.status(200).json({ success: true, data: user });
  } catch (error: unknown) {
    const err = error as any;
    res.status(err.status ?? 500).json({ message: err.message ?? "Something went wrong" });
  }
}

// PATCH /api/auth/update  (protected, multipart)
// - sends newPassword → change password path
// - otherwise       → update profile (name / email / avatar)
export async function update(req: Request, res: Response) {
  try {
    const userId = (req as any).userId as string;

    const currentPassword = clean(req.body.currentPassword) as string | undefined;
    const newPassword     = clean(req.body.newPassword)     as string | undefined;

    // --- Password change branch ---
    if (currentPassword !== undefined || newPassword !== undefined) {
      const parsed = ChangePasswordSchema.safeParse({ currentPassword, newPassword });
      if (!parsed.success) {
        res.status(400).json({ message: parsed.error.issues[0]?.message ?? "Validation failed", errors: parsed.error.issues });
        return;
      }
      const user = await changePasswordService(userId, parsed.data.currentPassword, parsed.data.newPassword);
      res.status(200).json({ success: true, message: "Password updated successfully", data: user });
      return;
    }

    // --- Profile update branch ---
    const parsed = UpdateProfileSchema.safeParse({
      name:  clean(req.body.name),
      email: clean(req.body.email),
    });
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.issues[0]?.message ?? "Validation failed", errors: parsed.error.issues });
      return;
    }

    const avatar = (req as any).file?.filename as string | undefined;
    const user = await updateProfileService(userId, { ...parsed.data, avatar });
    res.status(200).json({ success: true, message: "Profile updated successfully", data: user });
  } catch (error: unknown) {
    const err = error as any;
    res.status(err.status ?? 500).json({ message: err.message ?? "Something went wrong" });
  }
}
