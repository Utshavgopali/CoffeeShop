import type { Request, Response } from "express";
import { getNotificationsService, markNotificationReadService, markAllNotificationsReadService } from "../services/notification.service";
import { sendSuccess, sendError } from "../utils/apiResponse";

export async function getMyNotifications(req: Request, res: Response) {
  try {
    const notifications = await getNotificationsService((req as any).user.id);
    const unread = notifications.filter((n) => !n.read).length;
    return sendSuccess(res, { notifications, unread }, "Notifications retrieved successfully");
  } catch (error: any) { return sendError(res, error.message || "Internal server error", 500); }
}
export async function markMyNotificationRead(req: Request<{ id: string }>, res: Response) {
  try { return sendSuccess(res, await markNotificationReadService(req.params.id), "Notification marked as read"); }
  catch (error: any) { return sendError(res, error.message || "Internal server error", 500); }
}
export async function markAllMyNotificationsRead(req: Request, res: Response) {
  try { await markAllNotificationsReadService((req as any).user.id); return sendSuccess(res, null, "All notifications marked as read"); }
  catch (error: any) { return sendError(res, error.message || "Internal server error", 500); }
}