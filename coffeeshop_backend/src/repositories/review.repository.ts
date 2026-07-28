import mongoose from "mongoose";
import Review, { IReview } from "../models/review.model";

export interface ReviewSummary {
  average: number;
  count: number;
  breakdown: Record<1 | 2 | 3 | 4 | 5, number>;
}

export async function upsertReview(
  userId: string,
  beanId: string,
  data: { rating: number; comment: string; verifiedPurchase: boolean }
): Promise<IReview> {
  return Review.findOneAndUpdate(
    { user: userId, bean: beanId },
    { user: userId, bean: beanId, ...data },
    { upsert: true, new: true, runValidators: true }
  );
}

export async function findReviewByUserAndBean(userId: string, beanId: string): Promise<IReview | null> {
  return Review.findOne({ user: userId, bean: beanId });
}

export async function deleteReviewByUserAndBean(userId: string, beanId: string): Promise<IReview | null> {
  return Review.findOneAndDelete({ user: userId, bean: beanId });
}

export async function getReviewsByBeanPaginated(
  beanId: string,
  page: number,
  limit: number
): Promise<{ data: IReview[]; total: number }> {
  const query = { bean: beanId };
  const total = await Review.countDocuments(query);
  const data = await Review.find(query)
    .populate("user", "name avatar")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });
  return { data, total };
}

export async function getReviewSummary(beanId: string): Promise<ReviewSummary> {
  const result = await Review.aggregate([
    { $match: { bean: new mongoose.Types.ObjectId(beanId) } },
    { $group: { _id: "$rating", count: { $sum: 1 } } },
  ]);

  const breakdown: ReviewSummary["breakdown"] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let count = 0;
  let sum = 0;
  for (const row of result) {
    const rating = row._id as 1 | 2 | 3 | 4 | 5;
    breakdown[rating] = row.count;
    count += row.count;
    sum += rating * row.count;
  }

  return { average: count ? Math.round((sum / count) * 10) / 10 : 0, count, breakdown };
}
