import React, { useState } from "react";
import { Star, ThumbsUp, Flag, MessageSquare, Send, Sparkles, TrendingUp, CheckCircle, Pencil, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { userApi } from "../../services/user/userApi";
import toast from "react-hot-toast";

/* ─── Helpers ───────────────────────────────────────────────── */
const getRatingLabel = (r) => {
  if (r >= 5) return { label: "Outstanding", color: "#10b981" };
  if (r >= 4) return { label: "Excellent", color: "#22c55e" };
  if (r >= 3) return { label: "Good", color: "#f59e0b" };
  if (r >= 2) return { label: "Fair", color: "#f97316" };
  return { label: "Poor", color: "#ef4444" };
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const avatarGradients = [
  "linear-gradient(135deg,#667eea,#764ba2)",
  "linear-gradient(135deg,#f093fb,#f5576c)",
  "linear-gradient(135deg,#4facfe,#00f2fe)",
  "linear-gradient(135deg,#43e97b,#38f9d7)",
  "linear-gradient(135deg,#fa709a,#fee140)",
  "linear-gradient(135deg,#a18cd1,#fbc2eb)",
];

const pickGradient = (name = "") =>
  avatarGradients[name.charCodeAt(0) % avatarGradients.length];

/* ─── Star Row ───────────────────────────────────────────────── */
const StarRow = ({ count = 5, size = 16, value = 0, interactive = false, hovered = null, onSet, onHover, onLeave }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: count }).map((_, i) => {
      const filled = i < (interactive ? (hovered ?? value) : value);
      return (
        <button
          key={i}
          type={interactive ? "button" : undefined}
          onClick={interactive ? () => onSet(i + 1) : undefined}
          onMouseEnter={interactive ? () => onHover(i + 1) : undefined}
          onMouseLeave={interactive ? onLeave : undefined}
          className={interactive ? "cursor-pointer focus:outline-none" : ""}
          style={{ background: "none", border: "none", padding: "2px" }}
        >
          <motion.div
            whileHover={interactive ? { scale: 1.3 } : {}}
            whileTap={interactive ? { scale: 0.9 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <Star
              size={size}
              style={{
                fill: filled ? "#f59e0b" : "transparent",
                color: filled ? "#f59e0b" : "#d1d5db",
                transition: "fill 0.15s, color 0.15s",
              }}
            />
          </motion.div>
        </button>
      );
    })}
  </div>
);

/* ─── Rating Bar ─────────────────────────────────────────────── */
const RatingBar = ({ stars, count, total }) => {
  const pct = total > 0 ? (count / total) * 100 : 0;
  const barColor =
    stars >= 4 ? "#10b981" : stars === 3 ? "#f59e0b" : stars === 2 ? "#f97316" : "#ef4444";

  return (
    <div className="flex items-center gap-3 group">
      <span className="w-3 text-xs font-bold text-gray-500 text-right shrink-0">{stars}</span>
      <Star size={11} style={{ fill: "#f59e0b", color: "#f59e0b" }} className="shrink-0" />
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: barColor }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        />
      </div>
      <span className="w-5 text-right text-xs font-bold text-gray-400 shrink-0">{count}</span>
    </div>
  );
};

/* ─── Review Card ─────────────────────────────────────────── */
const ReviewCard = ({ review, idx, onHelpful, onReport, currentUser, onUpdateReview }) => {
  const { label, color } = getRatingLabel(review.rating);

  // Edit state (local to this card)
  const [isEditing, setIsEditing]     = useState(false);
  const [editRating, setEditRating]   = useState(review.rating);
  const [editHover, setEditHover]     = useState(null);
  const [editText, setEditText]       = useState(review.comment);
  const [isSaving, setIsSaving]       = useState(false);
  const [editSaved, setEditSaved]     = useState(false);

  // Only show Edit button if the logged-in user is the review author
  const isOwn =
    currentUser &&
    (currentUser.fullName || currentUser.name) === review.reviewerName;

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!editText.trim()) {
      toast.error("Review text cannot be empty.");
      return;
    }
    setIsSaving(true);
    try {
      await userApi.updateReview(review.id, editRating, editText.trim());
      setEditSaved(true);
      setTimeout(() => {
        setIsEditing(false);
        setEditSaved(false);
        onUpdateReview && onUpdateReview();
      }, 1800);
      toast.success("Review updated successfully!");
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        toast.error("You are not authorised to edit this review.");
      } else {
        toast.error(err?.response?.data?.message || "Failed to update review.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const openEdit = () => {
    setEditRating(review.rating);
    setEditText(review.comment);
    setEditSaved(false);
    setIsEditing(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: idx * 0.06 }}
      className="review-card"
      style={isOwn ? { borderColor: "#3b82f6", background: "linear-gradient(135deg,#fafbff,#eff6ff)" } : {}}
    >
      {/* Avatar + meta */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="review-avatar"
            style={{ background: pickGradient(review.reviewerName) }}
          >
            {getInitials(review.reviewerName)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-gray-900">{review.reviewerName}</p>
              {isOwn && (
                <span
                  className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ color: "#3b82f6", background: "#dbeafe" }}
                >
                  Your Review
                </span>
              )}
            </div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mt-0.5">
              {review.date}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <StarRow value={review.rating} size={13} />
          <span
            className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ color, background: `${color}18` }}
          >
            {label}
          </span>
        </div>
      </div>

      {/* Comment */}
      <p className="text-sm text-gray-600 mt-3.5 leading-relaxed">{review.comment}</p>

      {/* Inline Edit Form (AnimatePresence) */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            key="edit-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                background: "linear-gradient(135deg,#fafafa,#fff5f5)",
                border: "1.5px solid #fde8ea",
                borderRadius: 16,
                padding: "1.25rem",
                marginTop: "1rem",
              }}
            >
              {editSaved ? (
                <div className="success-check">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 12 }}
                  >
                    <CheckCircle size={40} style={{ color: "#10b981" }} />
                  </motion.div>
                  <p className="text-sm font-black text-gray-800">Review Updated!</p>
                </div>
              ) : (
                <form onSubmit={handleEditSave}>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                    Edit Your Review
                  </p>

                  {/* Star Rating */}
                  <div className="flex items-center gap-3 flex-wrap mb-4">
                    <StarRow
                      value={editRating}
                      hovered={editHover}
                      size={26}
                      interactive
                      onSet={setEditRating}
                      onHover={setEditHover}
                      onLeave={() => setEditHover(null)}
                    />
                    {(editHover || editRating) > 0 && (
                      <motion.span
                        key={editHover || editRating}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="label-pill"
                        style={{
                          color: getRatingLabel(editHover || editRating).color,
                          background: `${getRatingLabel(editHover || editRating).color}18`,
                          fontSize: "0.7rem",
                        }}
                      >
                        {getRatingLabel(editHover || editRating).label}
                      </motion.span>
                    )}
                  </div>

                  {/* Textarea */}
                  <textarea
                    rows={3}
                    maxLength={1000}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="review-input"
                    placeholder="Update your review…"
                    style={{ marginBottom: "0.5rem" }}
                  />
                  <p
                    className={`char-count ${
                      editText.length > 900 ? "over" : editText.length > 700 ? "warn" : ""
                    }`}
                    style={{ marginBottom: "0.875rem" }}
                  >
                    {editText.length} / 1000
                  </p>

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      type="submit"
                      disabled={isSaving || !editText.trim()}
                      className="submit-btn"
                      style={{ padding: "0.625rem 1.25rem", fontSize: "0.8rem" }}
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                          </svg>
                          Saving…
                        </>
                      ) : (
                        <>
                          <Send size={13} />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="write-btn cancel"
                      style={{ padding: "0.625rem 1rem", fontSize: "0.8rem" }}
                    >
                      <X size={13} />
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50">
        <button
          onClick={() => onHelpful(review.id)}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-emerald-600 transition-colors cursor-pointer"
        >
          <ThumbsUp size={12} />
          Helpful {review.helpfulCount > 0 && `(${review.helpfulCount})`}
        </button>
        <button
          onClick={() => onReport(review.id)}
          disabled={review.reported}
          className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
            review.reported
              ? "text-red-300 cursor-not-allowed"
              : "text-gray-400 hover:text-red-500 cursor-pointer"
          }`}
        >
          <Flag size={12} />
          {review.reported ? "Reported" : "Report"}
        </button>

        {/* Edit button — only for the review owner */}
        {isOwn && !isEditing && (
          <button
            onClick={openEdit}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors cursor-pointer ml-auto"
          >
            <Pencil size={12} />
            Edit
          </button>
        )}
        {isOwn && isEditing && (
          <span className="ml-auto text-[10px] font-bold text-blue-400 uppercase tracking-wider">
            Editing…
          </span>
        )}
      </div>
    </motion.div>
  );
};

/* ─── Main Component ─────────────────────────────────────────── */
const BookReviews = ({ reviews = [], bookId, onHelpfulClick, onReportClick, onSubmitReview, onUpdateReview, isLoading = false }) => {
  const { user, openAuthModal } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  const ratingCounts = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
  }));

  const { label: avgLabel, color: avgColor } = getRatingLabel(Math.round(parseFloat(averageRating)));

  const handleOpenForm = () => {
    if (!user) {
      openAuthModal("login");
      toast("Please log in to write a review.", { icon: "🔐" });
      return;
    }
    setShowForm((v) => !v);
    setSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      toast.error("Please write something in your review.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Call real API
      await userApi.submitReview(bookId, rating, reviewText.trim());

      // Optimistic local update
      const name = user?.fullName || user?.name || "You";
      onSubmitReview(name, rating, reviewText.trim());

      setSubmitted(true);
      setReviewText("");
      setRating(5);
      setTimeout(() => {
        setShowForm(false);
        setSubmitted(false);
      }, 2200);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) {
        toast.error("Review endpoint not found. Please contact support.");
      } else if (status === 401 || status === 403) {
        toast.error("You must be logged in to submit a review.");
      } else {
        toast.error(err?.response?.data?.message || "Failed to submit review. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* ── Scoped styles ── */}
      <style>{`
        .reviews-section {
          margin-top: 4rem;
          background: #fff;
          border: 1px solid #f1f5f9;
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,.04);
          position: relative;
          overflow: hidden;
        }
        .reviews-section::before {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 260px; height: 260px;
          background: radial-gradient(circle, rgba(227,30,46,.06) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }
        .review-form-wrap {
          background: linear-gradient(135deg, #fafafa 0%, #fff5f5 100%);
          border: 1.5px solid #fde8ea;
          border-radius: 20px;
          padding: 2rem;
          margin: 1.5rem 0;
        }
        .review-input {
          width: 100%;
          padding: 0.875rem 1.125rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 14px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #1f2937;
          background: #fff;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          resize: none;
          font-family: inherit;
        }
        .review-input:focus {
          border-color: #E31E2E;
          box-shadow: 0 0 0 3px rgba(227,30,46,.1);
        }
        .review-input::placeholder { color: #9ca3af; font-weight: 500; }
        .submit-btn {
          display: flex; align-items: center; justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem 2rem;
          border-radius: 14px;
          font-weight: 800; font-size: 0.875rem;
          color: #fff;
          background: linear-gradient(135deg, #E31E2E, #ff4d5e);
          border: none; cursor: pointer;
          box-shadow: 0 4px 15px rgba(227,30,46,.35);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(227,30,46,.45);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: .7; cursor: not-allowed; }
        .write-btn {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 14px;
          font-weight: 800; font-size: 0.8125rem;
          background: linear-gradient(135deg,#1f2937,#374151);
          color: #fff; border: none; cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,.15);
          transition: transform 0.15s, box-shadow 0.15s, background 0.2s;
          white-space: nowrap;
        }
        .write-btn:hover { background: linear-gradient(135deg,#E31E2E,#ff4d5e); transform: translateY(-1px); box-shadow: 0 6px 16px rgba(227,30,46,.35); }
        .write-btn.cancel { background: linear-gradient(135deg,#6b7280,#9ca3af); }
        .avg-score {
          font-size: 4.5rem; font-weight: 900; line-height: 1;
          background: linear-gradient(135deg,#1f2937,#374151);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .review-card {
          padding: 1.5rem;
          border-radius: 16px;
          background: #fafafa;
          border: 1.5px solid #f1f5f9;
          transition: border-color .2s, box-shadow .2s, transform .2s;
        }
        .review-card:hover {
          border-color: #fde8ea;
          box-shadow: 0 4px 20px rgba(0,0,0,.06);
          transform: translateY(-2px);
        }
        .review-avatar {
          width: 40px; height: 40px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 0.8125rem; color: #fff;
          flex-shrink: 0;
        }
        .label-pill {
          display: inline-flex; align-items: center; gap: 0.375rem;
          padding: 0.35rem 0.85rem;
          border-radius: 999px; font-size: 0.75rem; font-weight: 800;
        }
        .success-check {
          display: flex; flex-direction: column; align-items: center;
          gap: 0.5rem; padding: 1.5rem;
          animation: fadeScaleIn .4s ease;
        }
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(.8); }
          to   { opacity: 1; transform: scale(1); }
        }
        .char-count {
          font-size: 0.7rem; font-weight: 700; color: #9ca3af;
          text-align: right; margin-top: 4px;
        }
        .char-count.warn { color: #f97316; }
        .char-count.over { color: #ef4444; }
      `}</style>

      <section className="reviews-section">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-7 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} style={{ color: "#E31E2E" }} />
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                Community Ratings
              </span>
            </div>
            <h2 className="text-2xl font-serif font-black text-gray-900 tracking-tight">
              Ratings & Reviews
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {reviews.length > 0
                ? `${reviews.length} reader${reviews.length !== 1 ? "s" : ""} shared their thoughts`
                : "Be the first to leave a review!"}
            </p>
          </div>

          <button
            onClick={handleOpenForm}
            className={`write-btn ${showForm ? "cancel" : ""}`}
          >
            <MessageSquare size={15} />
            {showForm ? "Cancel" : "Write a Review"}
          </button>
        </div>

        {/* Review Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              key="form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <div className="review-form-wrap">
                {submitted ? (
                  <div className="success-check">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 12 }}
                    >
                      <CheckCircle size={52} style={{ color: "#10b981" }} />
                    </motion.div>
                    <p className="text-base font-black text-gray-800">Review Submitted!</p>
                    <p className="text-sm text-gray-500">Thank you for sharing your thoughts.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="flex items-center gap-2 mb-5">
                      <div
                        className="review-avatar"
                        style={{ background: pickGradient(user?.fullName || "You") }}
                      >
                        {getInitials(user?.fullName || "You")}
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-800">
                          {user?.fullName || "You"}
                        </p>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                          Posting as yourself
                        </p>
                      </div>
                    </div>

                    {/* Star Rating Picker */}
                    <div className="mb-5">
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                        Your Rating
                      </label>
                      <div className="flex items-center gap-4 flex-wrap">
                        <StarRow
                          value={rating}
                          hovered={hoverRating}
                          size={32}
                          interactive
                          onSet={setRating}
                          onHover={setHoverRating}
                          onLeave={() => setHoverRating(null)}
                        />
                        {(hoverRating || rating) > 0 && (
                          <motion.span
                            key={hoverRating || rating}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="label-pill"
                            style={{
                              color: getRatingLabel(hoverRating || rating).color,
                              background: `${getRatingLabel(hoverRating || rating).color}18`,
                            }}
                          >
                            {getRatingLabel(hoverRating || rating).label}
                          </motion.span>
                        )}
                      </div>
                    </div>

                    {/* Review Text */}
                    <div className="mb-5">
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                        Your Review
                      </label>
                      <textarea
                        required
                        rows={4}
                        maxLength={1000}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="What did you like or dislike? Share your honest thoughts about this book…"
                        className="review-input"
                      />
                      <p
                        className={`char-count ${
                          reviewText.length > 900
                            ? "over"
                            : reviewText.length > 700
                            ? "warn"
                            : ""
                        }`}
                      >
                        {reviewText.length} / 1000
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !reviewText.trim()}
                      className="submit-btn"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                          </svg>
                          Submitting…
                        </>
                      ) : (
                        <>
                          <Send size={15} />
                          Submit Review
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats + Reviews Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
          {/* Left: Summary */}
          <div className="lg:col-span-4 space-y-6">
            {/* Big score */}
            <div
              className="rounded-2xl p-6 text-center relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg,#1f2937 0%,#374151 100%)",
              }}
            >
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 30% 20%, #fff 0%, transparent 50%), radial-gradient(circle at 70% 80%, #E31E2E 0%, transparent 50%)",
                }}
              />
              <p className="avg-score" style={{ WebkitTextFillColor: "#fff", backgroundImage: "none" }}>
                {averageRating}
              </p>
              <div className="flex justify-center mt-2 mb-3">
                <StarRow value={Math.round(parseFloat(averageRating))} size={18} />
              </div>
              <span
                className="label-pill text-xs"
                style={{
                  color: avgColor,
                  background: `${avgColor}28`,
                  margin: "0 auto",
                  display: "inline-flex",
                }}
              >
                <TrendingUp size={11} />
                {avgLabel}
              </span>
              <p className="text-xs font-bold text-gray-400 mt-3">
                Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Bar chart */}
            <div className="space-y-2.5">
              {ratingCounts.map(({ stars, count }) => (
                <RatingBar
                  key={stars}
                  stars={stars}
                  count={count}
                  total={reviews.length}
                />
              ))}
            </div>
          </div>

          {/* Right: Review list */}
          <div className="lg:col-span-8">
            {isLoading ? (
              /* Skeleton loader */
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="review-card animate-pulse">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-3 w-28 bg-gray-200 rounded-full" />
                        <div className="h-2.5 w-20 bg-gray-100 rounded-full" />
                      </div>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(s => <div key={s} className="w-3 h-3 bg-gray-200 rounded-sm" />)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-gray-100 rounded-full" />
                      <div className="h-3 w-5/6 bg-gray-100 rounded-full" />
                      <div className="h-3 w-4/6 bg-gray-100 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                  style={{ background: "linear-gradient(135deg,#fde8ea,#fff5f5)" }}
                >
                  <MessageSquare size={32} style={{ color: "#E31E2E", opacity: 0.5 }} />
                </div>
                <p className="text-base font-black text-gray-700">No reviews yet</p>
                <p className="text-sm text-gray-400 mt-1 max-w-xs">
                  Share your experience and help fellow readers discover this book!
                </p>
                <button onClick={handleOpenForm} className="write-btn mt-5">
                  <MessageSquare size={14} />
                  Write the First Review
                </button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {[...reviews]
                  .sort((a, b) => {
                    const userName = user?.fullName || user?.name;
                    if (!userName) return 0;
                    const aIsOwn = a.reviewerName === userName;
                    const bIsOwn = b.reviewerName === userName;
                    if (aIsOwn && !bIsOwn) return -1;
                    if (!aIsOwn && bIsOwn) return 1;
                    return 0;
                  })
                  .map((review, idx) => (
                    <ReviewCard
                      key={review.id || idx}
                      review={review}
                      idx={idx}
                      onHelpful={onHelpfulClick}
                      onReport={onReportClick}
                      currentUser={user}
                      onUpdateReview={onUpdateReview}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default BookReviews;
