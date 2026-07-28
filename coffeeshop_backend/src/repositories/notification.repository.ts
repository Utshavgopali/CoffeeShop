import Notification, { INotification } from "../models/notification.model";

export async function createNotification(data: Partial<INotification>): Promise<INotification> { return new Notification(data).save(); }
export async function getNotificationsByUser(userId: string): Promise<INotification[]> {
  return Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(50);
}
export async function markAsRead(id: string): Promise<INotification | null> {
  return Notification.findByIdAndUpdate(id, { read: true }, { new: true });
}
export async function markAllAsRead(userId: string): Promise<void> {
  await Notification.updateMany({ user: userId, read: false }, { read: true });
}