import React, { useEffect, useState } from "react";
import { Reviews } from "@/api/base44Client";
import StarRating from "@/components/StarRating";
import TrustBadge from "@/components/TrustBadge";
import { MessageSquare } from "lucide-react";

export default function UserReviews({ userId, showTitle = true }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    Reviews.forUser(userId)
      .then(setReviews)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  if (loading) return <div className="flex justify-center py-8"><div className="w-6 h-6 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" /></div>;

  return (
    <div>
      {showTitle && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[#0D1F3C]">Reviews ({reviews.length})</h2>
          {avgRating && (
            <div className="flex items-center gap-2">
              <StarRating value={Math.round(avgRating)} readonly size={4} />
              <span className="font-bold text-[#0D1F3C]">{avgRating}</span>
              <span className="text-gray-400 text-sm">/ 5</span>
            </div>
          )}
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-10 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)" }}>
          <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No reviews yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border p-5" style={{ background: "#1A2235", borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ background: "#0D1F3C" }}>
                    {(r.reviewer_name || "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-[#0D1F3C] text-sm">{r.reviewer_name || "Anonymous"}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {r.reviewer_level && <TrustBadge level={r.reviewer_level} size="sm" showScore={false} />}
                      <span className="text-gray-400 text-xs capitalize">{r.reviewer_role}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <StarRating value={r.rating} readonly size={4} />
                  <div className="text-gray-400 text-xs mt-1">{new Date(r.created_date).toLocaleDateString("en-NG")}</div>
                </div>
              </div>
              {r.comment && <p className="text-slate-400 text-sm leading-relaxed italic">"{r.comment}"</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
