import axiosInstance from "./axios-instance";
import { ENDPOINTS } from "@/lib/endpoints";

export interface Review {
  _id: string;
  user: { _id: string; name: string; avatar?: string };
  bean: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface ReviewSummary {
  average: number;
  count: number;
  breakdown: Record<"1" | "2" | "3" | "4" | "5", number>;
}

export interface ReviewListResult {
  reviews: Review[];
  summary: ReviewSummary;
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export async function listReviews(beanId: string, page = 1, limit = 10): Promise<ReviewListResult> {
  const res = await axiosInstance.get(ENDPOINTS.REVIEWS.LIST(beanId), { params: { page, limit } });
  return { reviews: res.data.data.reviews, summary: res.data.data.summary, meta: res.data.meta };
}

export async function getMyReview(beanId: string): Promise<Review | null> {
  const res = await axiosInstance.get(ENDPOINTS.REVIEWS.MINE(beanId));
  return res.data.data;
}

export async function upsertReview(beanId: string, rating: number, comment: string): Promise<Review> {
  const res = await axiosInstance.post(ENDPOINTS.REVIEWS.LIST(beanId), { rating, comment });
  return res.data.data;
}

export async function deleteReview(beanId: string): Promise<void> {
  await axiosInstance.delete(ENDPOINTS.REVIEWS.LIST(beanId));
}
