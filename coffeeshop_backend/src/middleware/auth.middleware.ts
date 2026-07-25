import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/user.type";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Reads the JWT from the httpOnly cookie OR the Authorization Bearer header,
// verifies it, and attaches the decoded userId to the request.
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const fromCookie = (req as any).cookies?.token as string | undefined;
  const header = req.headers.authorization;
  const fromHeader = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  const token = fromCookie ?? fromHeader;

  if (!token) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    (req as any).userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
