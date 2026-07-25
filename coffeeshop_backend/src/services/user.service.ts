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