import { z } from "zod";

export const ReviewSchema = z.object({
  rating: z.coerce.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  comment: z.string().trim().min(3, "Comment must be at least 3 characters").max(1000, "Comment is too long"),
});
