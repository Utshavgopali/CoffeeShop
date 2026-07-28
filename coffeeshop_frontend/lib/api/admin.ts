import axiosInstance from "./axios-instance";
import { ENDPOINTS } from "@/lib/endpoints";
import type { Bean, Paginated } from "./beans";
import type { Order } from "./orders";

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
  provider: "local" | "google";
  createdAt: string;
}

export interface AdminUserListParams {
  page?: number;
  limit?: number;
  search?: string;
}

const multipart = { headers: { "Content-Type": undefined } };

export async function adminListUsers(params: AdminUserListParams = {}): Promise<Paginated<AdminUser>> {
  const res = await axiosInstance.get(ENDPOINTS.ADMIN.USERS.LIST, { params });
  return res.data;
}

export async function adminGetUser(id: string): Promise<AdminUser> {
  const res = await axiosInstance.get(ENDPOINTS.ADMIN.USERS.GET(id));
  return res.data.data;
}

export async function adminCreateUser(data: { name: string; email: string; password: string; role?: "user" | "admin" }): Promise<AdminUser> {
  const res = await axiosInstance.post(ENDPOINTS.ADMIN.USERS.CREATE, data);
  return res.data.data;
}

export async function adminUpdateUser(id: string, formData: FormData): Promise<AdminUser> {
  const res = await axiosInstance.put(ENDPOINTS.ADMIN.USERS.UPDATE(id), formData, multipart);
  return res.data.data;
}

export async function adminDeleteUser(id: string): Promise<void> {
  await axiosInstance.delete(ENDPOINTS.ADMIN.USERS.DELETE(id));
}

export interface AdminBeanListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export async function adminListBeans(params: AdminBeanListParams = {}): Promise<Paginated<Bean>> {
  const res = await axiosInstance.get(ENDPOINTS.ADMIN.BEANS.LIST, { params });
  return res.data;
}

export async function adminGetBean(id: string): Promise<Bean> {
  const res = await axiosInstance.get(ENDPOINTS.ADMIN.BEANS.GET(id));
  return res.data.data;
}

export async function adminCreateBean(formData: FormData): Promise<Bean> {
  const res = await axiosInstance.post(ENDPOINTS.ADMIN.BEANS.CREATE, formData, multipart);
  return res.data.data;
}

export async function adminUpdateBean(id: string, formData: FormData): Promise<Bean> {
  const res = await axiosInstance.put(ENDPOINTS.ADMIN.BEANS.UPDATE(id), formData, multipart);
  return res.data.data;
}

export async function adminDeleteBean(id: string): Promise<void> {
  await axiosInstance.delete(ENDPOINTS.ADMIN.BEANS.DELETE(id));
}

export interface AdminOrderListParams {
  page?: number;
  limit?: number;
}

export interface AdminOrder extends Order {
  user: { _id: string; name: string; email: string };
}

export async function adminListOrders(params: AdminOrderListParams = {}): Promise<Paginated<AdminOrder>> {
  const res = await axiosInstance.get(ENDPOINTS.ADMIN.ORDERS.LIST, { params });
  return res.data;
}

export async function adminCancelOrder(id: string): Promise<AdminOrder> {
  const res = await axiosInstance.patch(ENDPOINTS.ADMIN.ORDERS.CANCEL(id));
  return res.data.data;
}

export async function adminBroadcastNotification(data: { userIds: string[]; title: string; message: string }): Promise<void> {
  await axiosInstance.post(ENDPOINTS.ADMIN.NOTIFICATIONS.BROADCAST, data);
}
