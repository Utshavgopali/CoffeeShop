import type { Response } from "express";
import type { Request } from "express-serve-static-core";
import { registerService, loginService } from "../services/user.service";
import { RegisterSchema, LoginSchema } from "../types/user.type";
import User from "../models/user.model";
import { sendSuccess, sendError } from "../utils/apiResponse";

function firstIssue(parsed: any) { return parsed.error?.issues?.[0]?.message || "Validation failed"; }

export async function register(req: Request, res: Response) {
  try {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) return sendError(res, firstIssue(parsed), 400);
    const result = await registerService(parsed.data);
    return sendSuccess(res, result, "Registered successfully", 201);
  } catch (error: unknown) {
    return sendError(res, error instanceof Error ? error.message : "Something went wrong", 400);
  }
}

export async function login(req: Request, res: Response) {
  try {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) return sendError(res, firstIssue(parsed), 400);
    const result = await loginService(parsed.data);
    return sendSuccess(res, result, "Logged in successfully");
  } catch (error: unknown) {
    return sendError(res, error instanceof Error ? error.message : "Something went wrong", 400);
  }
}

export async function whoami(req: Request, res: Response) {
  try {
    const user = await User.findById((req as any).user.id).select("-password");
    if (!user) return sendError(res, "User not found", 404);
    return sendSuccess(res, user);
  } catch (error: unknown) {
    return sendError(res, error instanceof Error ? error.message : "Something went wrong", 500);
  }
}