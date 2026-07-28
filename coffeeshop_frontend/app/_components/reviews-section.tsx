"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, User as UserIcon } from "lucide-react";
import { StarRatingDisplay, StarRatingInput } from "./star-rating";
import { useUser } from "@/context/UserContext";
import {
  listReviews,
  getMyReview,
  upsertReview,
  deleteReview,
  type Review,
  type ReviewSummary,
} from "@/lib/api/reviews";

const EMPTY_SUMMARY: ReviewSummary = { average: 0, count: 0, breakdown: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 } };

export default function ReviewsSection({ beanId }: { beanId: string }) {
  const { user } = useUser();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary>(EMPTY_SUMMARY);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [myReview, setMyReview] = useState<Review | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  function loadReviews(pageToLoad: number, append: boolean) {
    setLoading(true);
    listReviews(beanId, pageToLoad, 10)
      .then((res) => {
        setReviews((prev) => (append ? [...prev, ...res.reviews] : res.reviews));
        setSummary(res.summary);
        setPage(res.meta.page);
        setTotalPages(res.meta.totalPages);
      })
      .catch(() => {
        if (!append) {
          setReviews([]);
          setSummary(EMPTY_SUMMARY);
        }
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- bean change reload
    loadReviews(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beanId]);

  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset form on logout
      setMyReview(null);
      setRating(0);
      setComment("");
      return;
    }
    getMyReview(beanId).then((review) => {
      setMyReview(review);
      setRating(review?.rating ?? 0);
      setComment(review?.comment ?? "");
    });
  }, [beanId, user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setMessage("Pick a star rating first");
      return;
    }
    setSubmitting(true);
    setMessage("");
    try {
      const saved = await upsertReview(beanId, rating, comment);
      setMyReview(saved);
      setMessage(myReview ? "Review updated" : "Review posted");
      loadReviews(1, false);
    } catch {
      setMessage("Could not save review");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    setSubmitting(true);
    setMessage("");
    try {
      await deleteReview(beanId);
      setMyReview(null);
      setRating(0);
      setComment("");
      setMessage("Review removed");
      loadReviews(1, false);
    } catch {
      setMessage("Could not remove review");
    } finally {
      setSubmitting(false);
    }
  }

  const breakdownRows = [5, 4, 3, 2, 1] as const;

  return (
    <section className="mt-16 border-t border-roast-700 pt-10">
      <h2 className="font-display text-2xl text-ivory">Reviews</h2>

      <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-[220px_1fr]">
        <div>
          <p className="font-display text-4xl text-ivory">{summary.average.toFixed(1)}</p>
          <StarRatingDisplay value={summary.average} size={18} />
          <p className="mt-1 font-mono text-xs text-ivory-dim">
            {summary.count} review{summary.count === 1 ? "" : "s"}
          </p>

          <div className="mt-4 space-y-1.5">
            {breakdownRows.map((star) => {
              const starCount = summary.breakdown[String(star) as "1" | "2" | "3" | "4" | "5"];
              const pct = summary.count ? Math.round((starCount / summary.count) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="w-3 font-mono text-[11px] text-ivory-dim">{star}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-roast-800">
                    <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          {user ? (
            <form onSubmit={handleSubmit} className="rounded-xl border border-roast-700 bg-roast-900 p-5">
              <p className="font-mono text-xs uppercase tracking-widest text-gold-dim">
                {myReview ? "Update your review" : "Leave a review"}
              </p>
              <div className="mt-3">
                <StarRatingInput value={rating} onChange={setRating} />
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you think of this bean?"
                rows={3}
                className="mt-3 w-full rounded-lg border border-roast-600 bg-roast-950 px-3 py-2 text-sm text-ivory outline-none placeholder:text-ivory-dim/40 focus:border-gold"
              />
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-gold px-5 py-2 font-body text-sm font-semibold text-ink transition hover:bg-gold-bright disabled:opacity-50"
                >
                  {myReview ? "Update review" : "Post review"}
                </button>
                {myReview && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={submitting}
                    className="font-mono text-xs text-clay hover:text-clay/80 disabled:opacity-50"
                  >
                    Delete
                  </button>
                )}
                {message && <span className="font-mono text-xs text-ivory-dim">{message}</span>}
              </div>
            </form>
          ) : (
            <div className="rounded-xl border border-dashed border-roast-700 p-5 text-center">
              <p className="font-body text-sm text-ivory-dim">
                <Link href="/login" className="text-gold hover:text-gold-bright">
                  Sign in
                </Link>{" "}
                to leave a review.
              </p>
            </div>
          )}

          <div className="mt-8 space-y-6">
            {reviews.length === 0 && !loading ? (
              <p className="font-body text-sm text-ivory-dim">No reviews yet — be the first to rate this bean.</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="border-b border-roast-800 pb-6 last:border-0">
                  <div className="flex items-center gap-3">
                    {review.user.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={review.user.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-roast-800 text-gold">
                        <UserIcon size={14} />
                      </span>
                    )}
                    <div>
                      <p className="font-body text-sm text-ivory">{review.user.name}</p>
                      <div className="flex items-center gap-2">
                        <StarRatingDisplay value={review.rating} size={13} />
                        {review.verifiedPurchase && (
                          <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wide text-moss-bright">
                            <ShieldCheck size={11} /> Verified purchase
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {review.comment && (
                    <p className="mt-3 font-body text-sm leading-relaxed text-ivory-dim">{review.comment}</p>
                  )}
                  <p className="mt-2 font-mono text-[11px] text-ivory-dim/60">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}

            {page < totalPages && (
              <button
                onClick={() => loadReviews(page + 1, true)}
                disabled={loading}
                className="font-mono text-xs text-gold-dim hover:text-gold disabled:opacity-50"
              >
                Load more reviews
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
