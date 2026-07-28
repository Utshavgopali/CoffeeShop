import {
  upsertReview,
  findReviewByUserAndBean,
  deleteReviewByUserAndBean,
  getReviewsByBeanPaginated,
  getReviewSummary,
} from "../repositories/review.repository";
import { userHasPurchasedBean } from "../repositories/order.repository";
import type { IReview } from "../models/review.model";

export async function upsertReviewService(
  userId: string,
  beanId: string,
  data: { rating: number; comment: string }
): Promise<IReview> {
  const verifiedPurchase = await userHasPurchasedBean(userId, beanId);
  return upsertReview(userId, beanId, { ...data, verifiedPurchase });
}

export async function getMyReviewService(userId: string, beanId: string): Promise<IReview | null> {
  return findReviewByUserAndBean(userId, beanId);
}

export async function deleteReviewService(userId: string, beanId: string): Promise<void> {
  const review = await deleteReviewByUserAndBean(userId, beanId);
  if (!review) throw new Error("Review not found");
}

export async function listReviewsService(beanId: string, page: number, limit: number) {
  const [{ data, total }, summary] = await Promise.all([
    getReviewsByBeanPaginated(beanId, page, limit),
    getReviewSummary(beanId),
  ]);
  return { data, total, summary };
}
