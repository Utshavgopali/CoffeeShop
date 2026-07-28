import { createNotification, getNotificationsByUser, markAsRead, markAllAsRead } from "../repositories/notification.repository";

export async function notifyOrderPlaced(userId: string, orderId: string) {
  return createNotification({ user: userId as any, title: "Order placed", message: `Your order #${orderId.slice(-6)} has been placed. Complete payment to confirm it.`, type: "order" });
}
export async function notifyOrderPaid(userId: string, orderId: string) {
  return createNotification({ user: userId as any, title: "Payment received", message: `Payment for order #${orderId.slice(-6)} was successful. Your beans are being prepared!`, type: "order" });
}
export async function notifyOrderCancelled(userId: string, orderId: string) {
  return createNotification({ user: userId as any, title: "Order cancelled", message: `Your order #${orderId.slice(-6)} has been cancelled.`, type: "order" });
}
export async function notifyProfileUpdate(userId: string, name: string, fields: string[]) {
  return createNotification({ user: userId as any, title: "Profile updated", message: `Hi ${name}, your ${fields.join(", ")} was updated successfully.`, type: "account" });
}
export async function getNotificationsService(userId: string) { return getNotificationsByUser(userId); }
export async function markNotificationReadService(id: string) { return markAsRead(id); }
export async function markAllNotificationsReadService(userId: string) { return markAllAsRead(userId); }