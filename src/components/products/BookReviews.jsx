import React, { useState } from "react";
import { Star, ThumbsUp, Flag, User, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BookReviews = ({ reviews = [], onHelpfulClick, onReportClick, onSubmitReview }) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(null);
  const [comment, setComment] = useState("");

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const ratingCounts = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => r.rating === stars).length
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    
    onSubmitReview(name.trim(), rating, comment.trim());
    setName("");
    setRating(5);
    setComment("");
    setShowForm(false);
  };

  return (
    <section className="mt-16 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-serif font-black text-gray-900 tracking-tight">Customer Reviews</h2>
          <p className="text-sm text-gray-500 mt-1">See what others are saying about this book</p>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-3 bg-gray-900 hover:bg-[#E31E2E] text-white font-bold text-sm rounded-xl transition duration-200 shadow-sm cursor-pointer self-start md:self-auto"
        >
          {showForm ? "Cancel" : "Write a Review"}
        </button>
      </div>

      {/* Review Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="py-6 border-b border-gray-100 space-y-4">
              <h3 className="text-lg font-bold text-gray-800">Share your thoughts</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl font-semibold text-gray-800 text-sm focus:outline-none focus:border-[#E31E2E] transition-all bg-gray-50/50"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Rating</label>
                  <div className="flex items-center gap-1.5 h-[46px]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          size={24}
                          className={`transition-colors ${
                            star <= (hoverRating || rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Review Comment</label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you like or dislike about this book?"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl font-semibold text-gray-800 text-sm focus:outline-none focus:border-[#E31E2E] transition-all bg-gray-50/50 resize-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-[#E31E2E] hover:bg-red-700 text-white font-bold text-sm rounded-xl transition duration-200 shadow-sm cursor-pointer"
              >
                Submit Review
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        {/* Rating breakdown summary */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6 text-center">
            <span className="text-5xl font-black text-gray-900 tracking-tight">{averageRating}</span>
            <div className="flex justify-center text-amber-400 my-2.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  className={star <= Math.round(parseFloat(averageRating)) ? "fill-current" : "text-gray-200"}
                />
              ))}
            </div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Based on {reviews.length} reviews</p>
          </div>

          <div className="space-y-2.5">
            {ratingCounts.map(({ stars, count }) => {
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-3 text-sm">
                  <span className="w-3 text-right font-bold text-gray-600">{stars}</span>
                  <Star size={14} className="fill-amber-400 text-amber-400 shrink-0" />
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-xs font-bold text-gray-400">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-8 space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-12 bg-gray-50/20 border border-dashed border-gray-200 rounded-2xl">
              <MessageSquare size={36} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-gray-500">No reviews yet</p>
              <p className="text-xs text-gray-400 mt-1">Be the first to review this book!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {reviews.map((review, idx) => (
                <div key={review.id || idx} className={`py-6 ${idx === 0 ? "pt-0" : ""}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-50 text-[#E31E2E] flex items-center justify-center font-bold text-sm">
                        {review.reviewerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{review.reviewerName}</h4>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{review.date}</span>
                      </div>
                    </div>
                    
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          className={star <= review.rating ? "fill-current" : "text-gray-200"}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mt-3.5 leading-relaxed font-normal">
                    {review.comment}
                  </p>

                  <div className="flex items-center gap-4 mt-4 text-xs font-bold text-gray-400">
                    <button
                      onClick={() => onHelpfulClick(review.id)}
                      className="flex items-center gap-1.5 hover:text-gray-700 transition cursor-pointer"
                    >
                      <ThumbsUp size={13} />
                      Helpful ({review.helpfulCount})
                    </button>
                    
                    <button
                      onClick={() => onReportClick(review.id)}
                      disabled={review.reported}
                      className={`flex items-center gap-1.5 transition ${
                        review.reported ? "text-red-400 cursor-not-allowed" : "hover:text-red-500 cursor-pointer"
                      }`}
                    >
                      <Flag size={13} />
                      {review.reported ? "Reported" : "Report"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BookReviews;
