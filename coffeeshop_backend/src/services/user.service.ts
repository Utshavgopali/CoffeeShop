import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "../repositories/user.repository";
import User from "../models/user.model";
import type { RegisterDTO, LoginDTO } from "../dtos/user.dto";
import type { AuthResponse } from "../types/user.type";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

function toAuthResponse(user: any, token: string): AuthResponse {
  return {
    token,
    user: { id: String(user._id), name: user.name, email: user.email, role: user.role, avatar: user.avatar, provider: user.provider },
  };
}

export async function registerService(data: RegisterDTO): Promise<AuthResponse> {
  const existing = await findUserByEmail(data.email);
  if (existing) throw new Error("Email already in use");
  const hashed = await bcrypt.hash(data.password, 10);
  const user = await createUser(data.name, data.email, hashed);
  const token = jwt.sign({ id: String(user._id) }, JWT_SECRET, { expiresIn: "7d" });
  return toAuthResponse(user, token);
}

export async function loginService(data: LoginDTO): Promise<AuthResponse> {
  const user = await findUserByEmail(data.email).then((u) => (u ? User.findById(u._id).select("+password") : null));
  if (!user || !user.password) throw new Error("Invalid email or password");
  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");
  const token = jwt.sign({ id: String(user._id) }, JWT_SECRET, { expiresIn: "7d" });
  return toAuthResponse(user, token);
}

import crypto from "crypto";
import { findUserByGoogleId, createGoogleUser, updateUserById } from "../repositories/user.repository";
import { verifyGoogleIdToken } from "../utils/googleAuth";
import { sendForgotPasswordCode } from "../utils/mailer";
import type { IUser } from "../models/user.model";

export async function googleLoginService(idToken: string): Promise<AuthResponse> {
  const profile = await verifyGoogleIdToken(idToken);
  let user = await findUserByGoogleId(profile.googleId);
  if (!user) {
    const existingLocal = await findUserByEmail(profile.email);
    if (existingLocal) {
      existingLocal.googleId = profile.googleId;
      existingLocal.provider = "google";
      if (!existingLocal.avatar && profile.avatar) existingLocal.avatar = profile.avatar;
      await existingLocal.save();
      user = existingLocal;
    } else {
      user = await createGoogleUser(profile.name, profile.email, profile.googleId, profile.avatar);
    }
  }
  const token = jwt.sign({ id: String(user._id) }, JWT_SECRET, { expiresIn: "7d" });
  return toAuthResponse(user, token);
}

export async function updateProfileService(
  userId: string,
  data: { name?: string; email?: string; avatar?: string }
): Promise<IUser> {
  if (data.email) {
    const existing = await findUserByEmail(data.email);
    if (existing && String(existing._id) !== userId) throw new Error("Email already in use");
  }
  const user = await updateUserById(userId, data);
  if (!user) throw new Error("User not found");
  return user;
}

export async function forgotPasswordRequestService(email: string): Promise<void> {
  const user = await findUserByEmail(email);
  if (!user) return; // don't reveal existence
  const code = crypto.randomInt(100000, 999999).toString();
  const salt = await bcrypt.genSalt(10);
  user.resetPasswordCode = await bcrypt.hash(code, salt);
  user.resetPasswordCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
  user.resetPasswordVerified = false;
  await user.save();
  await sendForgotPasswordCode(user.email, code);
}

export async function forgotPasswordVerifyService(email: string, code: string): Promise<void> {
  const user = await User.findOne({ email }).select("+resetPasswordCode +resetPasswordCodeExpires +resetPasswordVerified");
  if (!user || !user.resetPasswordCode || !user.resetPasswordCodeExpires) throw new Error("No pending reset request. Please request a new code.");
  if (user.resetPasswordCodeExpires.getTime() < Date.now()) throw new Error("This code has expired. Please request a new one.");
  const matches = await bcrypt.compare(code, user.resetPasswordCode);
  if (!matches) throw new Error("Invalid verification code");
  user.resetPasswordVerified = true;
  await user.save();
}

export async function forgotPasswordResetService(email: string, code: string, newPassword: string): Promise<void> {
  const user = await User.findOne({ email }).select("+resetPasswordCode +resetPasswordCodeExpires +resetPasswordVerified");
  if (!user || !user.resetPasswordCode || !user.resetPasswordCodeExpires) throw new Error("No pending reset request. Please request a new code.");
  if (user.resetPasswordCodeExpires.getTime() < Date.now()) throw new Error("This code has expired. Please request a new one.");
  const matches = await bcrypt.compare(code, user.resetPasswordCode);
  if (!matches) throw new Error("Invalid verification code");
  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordCode = undefined;
  user.resetPasswordCodeExpires = undefined;
  user.resetPasswordVerified = false;
  user.provider = "local";
  await user.save();
}
