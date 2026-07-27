import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProfile } from "@/api/base44Client";
import { auth } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import TrustBadge, { LEVELS } from "@/components/TrustBadge";
import StarRating from "@/components/StarRating";
import UserReviews from "@/components/UserReviews";
import { Shield, CheckCircle, AlertTriangle, Star, Calendar, Award, TrendingUp } from "lucide-react";

export default function Profile() {
  const { userId } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    auth.me().then(setCurrentUser).catch(() => {});
    getProfile(userId)
      .then(setProfile)
      .catch(() => setError("User not found"))
      .finally(() => setLoading(false));
  }, [userId]);

  const isOwnProfile = currentUser?.id === userId;
  const levelConfig = LEVELS[profile?.trust_level || "Bronze"];
  const completionRate = profile?.total_trades > 0
    ? Math.round((profile.completed_trades / profile.total_trades) * 100)
    : 0;

  return (
    <AppLayout user={currentUser}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-slate-400">{error}</p>
            <Link to="/dashboard" className="mt-4 inline-block text-sm font-semibold" style={{ color: "#00A651" }}>Go to Dashboard</Link>
          </div>
        ) : (
          <>
            {/* Profile Header */}
            <div className="rounded-3xl overflow-hidden mb-6 shadow-lg">
              {/* Cover */}
              <div className="h-32 relative" style={{ background: "linear-gradient(135deg, #0D1F3C 0%, #163560 100%)" }}>
                <div className="absolute inset-0 opacity-20"
                  style={{ background: `radial-gradient(circle at 30% 50%, ${levelConfig?.color || "#00A651"}, transparent 60%)` }} />
              </div>
              {/* Profile info */}
              <div className="px-8 pb-8" style={{ background: "#111827" }}>
                <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-12 mb-6">
                  <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-xl border-4 border-white"
                    style={{ background: "linear-gradient(135deg, #0D1F3C, #163560)" }}>
                    {(profile.full_name || profile.email || "?")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 pt-2 md:pt-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h1 className="text-2xl font-black text-white">{profile.full_name || "Anonymous"}</h1>
                      {profile.kyc_status === "verified" && (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: "#f0fff7", color: "#00A651" }}>
                          <CheckCircle className="w-3 h-3" /> KYC Verified
                        </span>
                      )}
                      {profile.status === "suspended" && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600">Suspended</span>
                      )}
                    </div>
                    <TrustBadge level={profile.trust_level} score={profile.trust_score} size="md" showScore />
                  </div>
                  {isOwnProfile && (
                    <Link to="/wallet" className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-semibold text-slate-400 hover:bg-transparent transition-all">
                      Edit Profile
                    </Link>
                  )}
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: CheckCircle, label: "Completed Trades", value: profile.completed_trades, color: "#00A651" },
                    { icon: Star, label: "Avg Rating", value: profile.rating_avg ? `${profile.rating_avg}/5` : "No ratings", color: "#ffc107" },
                    { icon: TrendingUp, label: "Completion Rate", value: `${completionRate}%`, color: "#2563eb" },
                    { icon: Calendar, label: "Member Since", value: new Date(profile.member_since).toLocaleDateString("en-NG", { month: "short", year: "numeric" }), color: "#7c3aed" },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="text-center p-4 rounded-2xl border" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.06)" }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2" style={{ background: color + "15" }}>
                        <Icon className="w-4 h-4" style={{ color }} />
                      </div>
                      <div className="font-black text-white text-lg">{value}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Left column */}
              <div className="space-y-4">
                {/* Trust breakdown */}
                <div className="rounded-2xl border p-5" style={{ background: "#111827", borderColor: "rgba(255,255,255,0.06)" }}>
                  <h2 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4" style={{ color: "#00A651" }} /> Trust Score
                  </h2>
                  <div className="text-center mb-4">
                    <div className="text-5xl font-black mb-1" style={{ color: levelConfig?.color || "#00A651" }}>
                      {profile.trust_score}
                    </div>
                    <div className="text-slate-500 text-sm">points</div>
                  </div>
                  <TrustBadge level={profile.trust_level} score={profile.trust_score} size="sm" showScore showBar />
                </div>

                {/* Verification status */}
                <div className="rounded-2xl border p-5" style={{ background: "#111827", borderColor: "rgba(255,255,255,0.06)" }}>
                  <h2 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4" style={{ color: "#00A651" }} /> Verification
                  </h2>
                  <div className="space-y-3">
                    {[
                      { label: "Email Verified", done: true },
                      { label: "Phone Number", done: true },
                      { label: "Identity (KYC)", done: profile.kyc_status === "verified" },
                      { label: "Business Verified", done: false },
                    ].map(({ label, done }) => (
                      <div key={label} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0`}
                          style={{ background: done ? "#00A651" : "#f3f4f6" }}>
                          {done
                            ? <CheckCircle className="w-3 h-3 text-white" />
                            : <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
                        </div>
                        <span className={`text-sm ${done ? "text-white font-medium" : "text-slate-500"}`}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trade summary */}
                <div className="rounded-2xl border p-5" style={{ background: "#111827", borderColor: "rgba(255,255,255,0.06)" }}>
                  <h2 className="font-bold text-white mb-4">Trade Summary</h2>
                  <div className="space-y-3">
                    {[
                      { label: "Total Trades", value: profile.total_trades || 0, color: "#94A3B8" },
                      { label: "Completed", value: profile.completed_trades || 0, color: "#16C47F" },
                      { label: "Disputed", value: profile.disputed_trades || 0, color: "#EF4444" },
                      { label: "Success Rate", value: `${completionRate}%`, color: "#3B82F6" },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="flex justify-between items-center text-white">
                        <span className="text-slate-400 text-sm">{label}</span>
                        <span className="font-bold text-sm" style={{ color }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column - Reviews */}
              <div className="md:col-span-2">
                <div className="rounded-2xl border p-6" style={{ background: "#111827", borderColor: "rgba(255,255,255,0.06)" }}>
                  {/* Rating summary */}
                  {profile.rating_count > 0 && (
                    <div className="flex items-center gap-6 mb-6 p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <div className="text-center">
                        <div className="text-5xl font-black text-white">{profile.rating_avg}</div>
                        <StarRating value={Math.round(profile.rating_avg)} readonly size={5} />
                        <div className="text-slate-500 text-xs mt-1">{profile.rating_count} review{profile.rating_count !== 1 ? "s" : ""}</div>
                      </div>
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const count = profile.reviews?.filter(r => r.rating === star).length || 0;
                          const pct = profile.reviews?.length > 0 ? (count / profile.reviews.length) * 100 : 0;
                          return (
                            <div key={star} className="flex items-center gap-2">
                              <span className="text-xs text-slate-500 w-4">{star}</span>
                              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                                <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-xs text-slate-500 w-4">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <UserReviews userId={userId} showTitle />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
