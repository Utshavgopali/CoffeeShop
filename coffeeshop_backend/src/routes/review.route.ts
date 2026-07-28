import { Router } from "express";
import { protect } from "../middleware/auth";
import { listReviews, getMyReview, upsertReviewItem, deleteReviewItem } from "../controllers/review.controller";

const router = Router({ mergeParams: true });

router.get("/", listReviews);
router.get("/mine", protect, getMyReview);
router.post("/", protect, upsertReviewItem);
router.delete("/", protect, deleteReviewItem);

export default router;
