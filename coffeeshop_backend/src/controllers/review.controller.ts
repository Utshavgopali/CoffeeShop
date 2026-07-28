import type { Response } from "express";
import type { Request } from "express-serve-static-core";
import {
  upsertReviewService,
  getMyReviewService,
  deleteReviewService,
  listReviewsService,
} from "../services/review.service";
import { ReviewSchema } from "../types/review.type";
import { sendSuccess, sendError } from "../utils/apiResponse";

function firstIssue(parsed: any) {
  return parsed.error?.issues?.[0]?.message || "Validation failed";
}

// @route  GET /api/v1/beans/:beanId/reviews
export async function listReviews(req: Request<{ beanId: string }>, res: Response) {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const { data, total, summary } = await listReviewsService(req.params.beanId, page, limit);
    return sendSuccess(res, { reviews: data, summary }, "Reviews fetched", 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: unknown) {
    return sendError(res, error instanceof Error ? error.message : "Something went wrong", 500);
  }
}

// @route  GET /api/v1/beans/:beanId/reviews/mine
export async function getMyReview(req: Request<{ beanId: string }>, res: Response) {
  try {
    const review = await getMyReviewService((req as any).user.id, req.params.beanId);
    return sendSuccess(res, review, "Review fetched");
  } catch (error: unknown) {
    return sendError(res, error instanceof Error ? error.message : "Something went wrong", 500);
  }
}

// @route  POST /api/v1/beans/:beanId/reviews
export async function upsertReviewItem(req: Request<{ beanId: string }>, res: Response) {
  try {
    const parsed = ReviewSchema.safeParse(req.body);
    if (!parsed.success) return sendError(res, firstIssue(parsed), 400);

    const review = await upsertReviewService((req as any).user.id, req.params.beanId, parsed.data);
    return sendSuccess(res, review, "Review saved", 201);
  } catch (error: unknown) {
    return sendError(res, error instanceof Error ? error.message : "Something went wrong", 400);
  }
}

// @route  DELETE /api/v1/beans/:beanId/reviews
export async function deleteReviewItem(req: Request<{ beanId: string }>, res: Response) {
  try {
    await deleteReviewService((req as any).user.id, req.params.beanId);
    return sendSuccess(res, null, "Review deleted");
  } catch (error: unknown) {
    return sendError(res, error instanceof Error ? error.message : "Something went wrong", 404);
  }
}
