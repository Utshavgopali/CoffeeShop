import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  findUserByEmail,
  createUser,
  findUserById,
  findUserByIdWithPassword,
  updateUserById,
} from "../repositories/user.repository";
import type { RegisterDTO, LoginDTO, UpdateProfileDTO, UserResponseDTO } from "../dtos/user.dto";
import type { AuthResponse, JwtPayload } from "../types/user.type";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Strip the password and reshape the doc into a safe client response.
// Avatar is returned as /api/uploads/<file> so it passes through the Next.js proxy.
function toResponse(user: {
  _id: unknown;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}): UserResponseDTO {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    avatar: user.avatar ? `/api/uploads/${user.avatar}` : null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function signToken(id: string, email: string): string {
  const payload: JwtPayload = { id, email };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" } as jwt.SignOptions);
}

// REGISTER
export async function registerService(data: RegisterDTO): Promise<AuthResponse> {
  const existing = await findUserByEmail(data.email);
  if (existing) {
    const err: any = new Error("Email already in use");
    err.status = 409;
    throw err;
  }
  const hashed = await bcrypt.hash(data.password, 10);
  const user = await createUser(data.name, data.email, hashed);
  const userId = String(user._id);
  const token = signToken(userId, user.email);
  return { token, user: { id: userId, name: user.name, email: user.email } };
}

// LOGIN
export async function loginService(data: LoginDTO): Promise<AuthResponse> {
  const user = await findUserByEmail(data.email);
  if (!user) {
    const err: any = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }
  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) {
    const err: any = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }
  const userId = String(user._id);
  const token = signToken(userId, user.email);
  return { token, user: { id: userId, name: user.name, email: user.email } };
}

// WHOAMI — returns full UserResponseDTO (including avatar + timestamps).
export async function getMeService(id: string): Promise<UserResponseDTO | null> {
  const user = await findUserById(id);
  if (!user) return null;
  return toResponse(user as any);
}

// UPDATE PROFILE — name / email / avatar, each optional.
export async function updateProfileService(
  id: string,
  dto: UpdateProfileDTO
): Promise<UserResponseDTO> {
  if (dto.email) {
    const existing = await findUserByEmail(dto.email);
    if (existing && String(existing._id) !== id) {
      const err: any = new Error("That email is already in use");
      err.status = 409;
      throw err;
    }
  }
  const updates: Record<string, string> = {};
  if (dto.name)              updates.name   = dto.name;
  if (dto.email)             updates.email  = dto.email;
  if (dto.avatar !== undefined) updates.avatar = dto.avatar;

  const updated = await updateUserById(id, updates as any);
  if (!updated) {
    const err: any = new Error("User not found");
    err.status = 404;
    throw err;
  }
  return toResponse(updated as any);
}

// CHANGE PASSWORD — verifies current password, then sets the new one.
export async function changePasswordService(
  id: string,
  currentPassword: string,
  newPassword: string
): Promise<UserResponseDTO> {
  const user = await findUserByIdWithPassword(id);
  if (!user) {
    const err: any = new Error("User not found");
    err.status = 404;
    throw err;
  }
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    const err: any = new Error("Current password is incorrect");
    err.status = 401;
    throw err;
  }
  const hashed = await bcrypt.hash(newPassword, 10);
  const updated = await updateUserById(id, { password: hashed });
  if (!updated) {
    const err: any = new Error("User not found");
    err.status = 404;
    throw err;
  }
  return toResponse(updated as any);
}
