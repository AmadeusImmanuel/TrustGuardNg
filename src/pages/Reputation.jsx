import React, { useEffect, useState } from "react";
import { auth, request } from "@/api/base44Client";
import UserReviews from "@/components/UserReviews";
import AppLayout from "@/components/AppLayout";
import TrustBadge, { LEVELS } from "@/components/TrustBadge";
import { Shield, TrendingUp, AlertTriangle, CheckCircle, Clock, Star } from "lucide-react";

const METRIC_TONES = {
  primary: "text-primary bg-primary/15",
  info: "text-info bg-info/15",
  accent: "text-primary bg-primary/15",
  danger: "text-danger bg-danger/15",
};

export default function Reputation() {
  const [user, setUser] = useState(null);
  const [reputation, setReputation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const u = await auth.me();
        setUser(u);
        const rep = await request("GET", `/users/${u.id}/reputation`);
        setReputation(rep);
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, []);

  const levels = Object.entries(LEVELS);

  return (
    <AppLayout user={user}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-foreground mb-2">Trust & Reputation</h1>
        <p className="text-muted text-sm mb-8">Your trust score reflects your trading history, identity verification, and dispute record.</p>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" /></div>
        ) : (
          <>
            {/* Main score card */}
            <div className="rounded-3xl p-8 text-primary-foreground mb-6 relative overflow-hidden bg-brand-gradient">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl bg-primary" />
              <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl bg-white/10">
                  {LEVELS[reputation?.level || "Bronze"]?.emoji}
                </div>
                <div className="flex-1">
                  <div className="text-white/60 text-sm mb-1">Your Trust Level</div>
                  <div className="text-4xl font-black mb-2">{reputation?.level || "Bronze"}</div>
                  <TrustBadge level={reputation?.level || "Bronze"} score={reputation?.score || 0} size="lg" showScore showBar />
                </div>
                <div className="text-right">
                  <div className="text-white/60 text-sm mb-1">Trust Score</div>
                  <div className="text-6xl font-black text-primary">{reputation?.score || 0}</div>
                  <div className="text-white/40 text-sm mt-1">points</div>
                </div>
              </div>
            </div>

            {/* Score breakdown */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {[
                { icon: CheckCircle, label: "Completed Trades", value: reputation?.completedTrades || 0, points: `+${(reputation?.completedTrades || 0) * 20} pts`, tone: "primary", desc: "20 points each" },
                { icon: Clock, label: "Account Age", value: `${Math.round(reputation?.accountAgeDays || 0)} days`, points: `+${Math.min(Math.round((reputation?.accountAgeDays || 0) * 0.1), 36)} pts`, tone: "info", desc: "Up to 36 points" },
                { icon: Shield, label: "KYC Verification", value: user?.kyc_status || "none", points: `+${reputation?.kycScore || 0} pts`, tone: "accent", desc: "Up to 30 points" },
                { icon: AlertTriangle, label: "Disputes Against You", value: reputation?.disputesAgainst || 0, points: `-${(reputation?.disputesAgainst || 0) * 15} pts`, tone: "danger", desc: "-15 points each" },
              ].map(({ icon: Icon, label, value, points, tone, desc }) => (
                <div key={label} className="bg-card rounded-2xl border border-border p-5 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${METRIC_TONES[tone]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="text-muted text-xs mb-0.5">{label}</div>
                    <div className="font-bold text-foreground capitalize">{String(value)}</div>
                    <div className="text-xs text-muted">{desc}</div>
                  </div>
                  <div className={`font-bold text-sm ${METRIC_TONES[tone].split(" ")[0]}`}>{points}</div>
                </div>
              ))}
            </div>

            {/* Level progression */}
            <div className="bg-card rounded-2xl border border-border p-6 mb-6">
              <h2 className="font-bold text-foreground mb-6">Level Progression</h2>
              <div className="space-y-4">
                {levels.map(([name, config]) => {
                  const isCurrentLevel = name === (reputation?.level || "Bronze");
                  const isPassed = (reputation?.score || 0) >= config.min;
                  return (
                    <div key={name} className={`flex items-center gap-4 p-4 rounded-xl transition-all ${isCurrentLevel ? "border-2" : "border border-border"}`}
                      style={isCurrentLevel ? { borderColor: config.color, background: config.bg } : {}}>
                      <div className="text-2xl">{config.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm" style={{ color: isPassed ? config.color : undefined }}>{name}</span>
                          {isCurrentLevel && <span className="text-xs px-2 py-0.5 rounded-full text-white font-semibold" style={{ background: config.color }}>Current</span>}
                        </div>
                        <div className="text-xs text-muted">{config.min === 0 ? "Starting level" : `${config.min}+ points required`}</div>
                      </div>
                      <div className="text-right">
                        {isPassed ? (
                          <CheckCircle className="w-5 h-5" style={{ color: config.color }} />
                        ) : (
                          <div className="text-xs text-muted">{config.min - (reputation?.score || 0)} pts needed</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* How to improve */}
            <div className="bg-primary/5 rounded-2xl border border-primary/20 p-6">
              <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> How to Improve Your Score
              </h2>
              <div className="space-y-3">
                {[
                  { action: "Complete more trades successfully", points: "+20 pts per trade", done: false },
                  { action: "Verify your identity (KYC)", points: "+30 pts", done: user?.kyc_status === "verified" },
                  { action: "Maintain account for 1 year", points: "+36 pts max", done: (reputation?.accountAgeDays || 0) >= 365 },
                  { action: "Avoid disputes being raised against you", points: "Protect your score", done: (reputation?.disputesAgainst || 0) === 0 },
                ].map(({ action, points, done }) => (
                  <div key={action} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${done ? "bg-primary" : "border-2 border-border"}`}>
                      {done && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-sm flex-1 ${done ? "line-through text-muted" : "text-text-secondary"}`}>{action}</span>
                    <span className="text-xs font-semibold text-primary">{points}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-2xl border border-border p-6 mt-6">
              <UserReviews userId={user?.id} />
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
