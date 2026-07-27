import React, { useState } from "react";
import { Reviews } from "@/api/base44Client";
import StarRating from "@/components/StarRating";
import { X, CheckCircle } from "lucide-react";

export default function ReviewModal({ trade, currentUser, onClose, onSubmitted }) {
  const isBuyer = trade.buyer_id === currentUser?.id;
  const revieweeId = isBuyer ? trade.seller_id : trade.buyer_id;
  const revieweeName = isBuyer ? (trade.seller_name || trade.seller_email) : (trade.buyer_name || trade.buyer_email);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (rating === 0) return setError("Please select a rating");
    if (!revieweeId) return setError("Cannot identify the other party");
    setLoading(true);
    setError("");
    try {
      await Reviews.create({
        trade_id: trade.id,
        reviewee_id: revieweeId,
        rating,
        comment,
        reviewer_role: isBuyer ? "buyer" : "seller",
      });
      setDone(true);
      onSubmitted && onSubmitted();
    } catch (err) {
      setError(err.message || "Failed to submit review");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="rounded-3xl w-full max-w-md shadow-2xl overflow-hidden" style={{ background: "#fff" }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-black text-[#0D1F3C] text-lg">Leave a Review</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {done ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#f0fff7" }}>
              <CheckCircle className="w-8 h-8" style={{ color: "#00A651" }} />
            </div>
            <h3 className="font-black text-[#0D1F3C] text-xl mb-2">Review Submitted!</h3>
            <p className="text-gray-500 text-sm mb-6">Thank you for helping build trust in the TrustGuard community.</p>
            <button onClick={onClose} className="px-6 py-3 rounded-full text-white font-semibold text-sm" style={{ background: "#00A651" }}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="p-6 space-y-5">
            {/* Reviewee info */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{ background: "#0D1F3C" }}>
                {(revieweeName || "?")[0].toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-[#0D1F3C] text-sm">{revieweeName || "Unknown"}</div>
                <div className="text-gray-400 text-xs">Your {isBuyer ? "seller" : "buyer"} on: {trade.item_name}</div>
              </div>
            </div>

            {/* Star rating */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Rating *</label>
              <StarRating value={rating} onChange={setRating} size={8} />
              {rating > 0 && (
                <div className="text-sm text-gray-500 mt-2">
                  {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
                </div>
              )}
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Comment (optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500 resize-none text-gray-900 bg-white placeholder-gray-400"
                placeholder="Describe your experience with this trader..."
              />
            </div>

            {error && <div className="px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>}

            <div className="flex gap-3">
              <button type="button" onClick={onClose}
                className="flex-1 py-3 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" disabled={loading || rating === 0}
                className="flex-1 py-3 rounded-full text-white text-sm font-semibold disabled:opacity-50"
                style={{ background: "#00A651" }}>
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
