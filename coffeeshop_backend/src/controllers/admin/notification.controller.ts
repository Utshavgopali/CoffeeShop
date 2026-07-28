import type { Request, Response } from "express";
import Notification from "../../models/notification.model";
import { sendSuccess, sendError } from "../../utils/apiResponse";

// Simple broadcast: send a system notification to every listed user
export async function broadcastNotification(req: Request, res: Response) {
  try {
    const { userIds, title, message } = req.body;
    if (!title || !message || !Array.isArray(userIds)) {
      return sendError(res, "userIds[], title and message are required", 400);
    }
    const docs = userIds.map((user: string) => ({ user, title, message, type: "system" }));
    await Notification.insertMany(docs);
    return sendSuccess(res, null, "Notification broadcast sent", 201);
  } catch (error: any) {
    return sendError(res, error.message || "Internal server error", 500);
  }
}