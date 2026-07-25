import axiosInstance from "./axios-instance";
import { ENDPOINTS } from "./endpoints";

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "order" | "account" | "system";
  read: boolean;
  createdAt: string;
}

export async function getMyNotifications(): Promise<{ notifications: Notification[]; unread: number }> {
  const res = await axiosInstance.get(ENDPOINTS.NOTIFICATIONS.LIST);
  return res.data.data;
}

export async function markNotificationRead(id: string): Promise<void> {
  await axiosInstance.patch(ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
}

export async function markAllRead(): Promise<void> {
  await axiosInstance.patch(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
}