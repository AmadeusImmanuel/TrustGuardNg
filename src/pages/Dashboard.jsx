import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, myTrades, Dispute, request } from "@/api/base44Client";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import MetricCard from "@/components/ui/MetricCard";
import StatusBadge from "@/components/ui/StatusBadge";
import QuickAction from "@/components/ui/QuickAction";
import TrustBadge from "@/components/TrustBadge";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import {
  Wallet, ArrowLeftRight, AlertTriangle, TrendingUp,
  Plus, Shield, ChevronRight,
  CheckCircle, Clock, Zap
} from "lucide-react";

const CHART_DATA = [
  { day: "Mon", value: 42000 }, { day: "Tue", value: 78000 },
  { day: "Wed", value: 55000 }, { day: "Thu", value: 120000 },
  { day: "Fri", value: 95000 }, { day: "Sat", value: 160000 },
  { day: "Sun", value: 140000 },
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [trades, setTrades] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [reputation, setReputation] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const u = await auth.me();
        if (!mounted) return;
        setUser(u);
        const [t, d] = await Promise.all([myTrades(), Dispute.list()]);
        if (!mounted) return;
        setTrades(t || []);
        setDisputes(d || []);
        request("GET", `/users/${u.id}/reputation`).then(r => { if (mounted) setReputation(r); }).catch(() => {});
      } catch (e) { console.error(e); }
      if (mounted) setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  const fmt = (v) => "₦" + (Number(v) || 0).toLocaleString("en-NG", { minimumFractionDigits: 0 });
  const activeTrades = trades.filter(t => !["Confirmed", "Resolved", "Cancelled"].includes(t.status));
  const escrowTotal = activeTrades.reduce((s, t) => s + (Number(t.amount) || 0), 0);
  const completedTrades = trades.filter(t => ["Confirmed", "Resolved"].includes(t.status));

  return (
    <AppLayout user={user}>
      <div className="px-4 lg:px-8 py-6 max-w-7xl mx-auto">

        {/* Welcome header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-black text-foreground">
                Welcome back, {user?.full_name?.split(" ")[0] || "there"} 👋
              </h1>
              <p className="text-muted text-sm mt-1">Here's what's happening with your escrow account.</p>
            </div>
            {reputation && (
              <div className="hidden md:block">
                <TrustBadge level={reputation.level} score={reputation.score} size="sm" showScore />
              </div>
            )}
          </div>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard icon={Wallet} label="Wallet Balance" value={fmt(user?.wallet_balance || 0)}
            description="Available to withdraw" tone="primary" delay={0} />
          <MetricCard icon={Shield} label="Escrow Total" value={fmt(escrowTotal)}
            description={`${activeTrades.length} active trade${activeTrades.length !== 1 ? "s" : ""}`} tone="info" delay={0.05} />
          <MetricCard icon={CheckCircle} label="Completed" value={completedTrades.length}
            description="Successful trades" tone="success" delay={0.1} />
          <MetricCard icon={AlertTriangle} label="Disputes" value={disputes.length}
            description="Total raised" tone="danger" delay={0.15} />
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-12 gap-6">

          {/* Left — Recent trades + chart */}
          <div className="lg:col-span-8 space-y-6">

            {/* Chart */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="rounded-2xl p-5 border border-border bg-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-bold text-foreground text-sm">Escrow Volume</div>
                  <div className="text-xs text-muted mt-0.5">Last 7 days</div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-success/10 text-success">
                  <TrendingUp className="w-3 h-3" /> +24% this week
                </div>
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={CHART_DATA}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#08B95F" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#08B95F" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#8D99AE" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "rgb(var(--card))", border: "1px solid rgb(var(--border) / 0.2)", borderRadius: 10, fontSize: 12, color: "rgb(var(--foreground))" }}
                    formatter={v => ["₦" + v.toLocaleString("en-NG"), "Volume"]} />
                  <Area type="monotone" dataKey="value" stroke="#08B95F" strokeWidth={2} fill="url(#grad)" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Recent Trades */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div className="font-bold text-foreground text-sm">Recent Trades</div>
                <Link to="/trades" className="flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:opacity-80">
                  View all <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="w-6 h-6 border-2 border-border border-t-primary rounded-full animate-spin" />
                </div>
              ) : trades.length === 0 ? (
                <div className="text-center py-12">
                  <ArrowLeftRight className="w-8 h-8 text-disabled mx-auto mb-3" />
                  <p className="text-muted text-sm">No trades yet</p>
                  <Link to="/trades/new" className="mt-3 inline-block text-xs font-semibold text-primary">
                    Create your first trade →
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {trades.slice(0, 8).map((t, i) => (
                    <motion.div key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.05 }}>
                      <Link to={`/trades/${t.id}`}
                        className="flex items-center gap-4 px-5 py-3.5 hover:bg-card-hover transition-colors group">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-primary text-sm font-black bg-primary/15">
                          {(t.item_name || "T")[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-foreground truncate">{t.item_name}</div>
                          <div className="text-xs text-muted mt-0.5">{t.reference} · {new Date(t.created_date).toLocaleDateString("en-NG")}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-bold text-foreground">{fmt(t.amount)}</div>
                          <div className="mt-1"><StatusBadge status={t.status} /></div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-disabled group-hover:text-muted transition-colors shrink-0" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right — Quick actions + widgets */}
          <div className="lg:col-span-4 space-y-4">

            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="rounded-2xl p-4 border border-border bg-card">
              <div className="font-bold text-foreground text-sm mb-3">Quick Actions</div>
              <div className="space-y-2">
                <QuickAction icon={Plus} title="Create Trade" description="Start a new escrow" tone="primary"
                  onClick={() => navigate("/trades/new")} />
                <QuickAction icon={Wallet} title="Withdraw Funds" description="Transfer to bank" tone="info"
                  onClick={() => navigate("/wallet")} />
                <QuickAction icon={AlertTriangle} title="View Disputes" description="Manage your disputes" tone="danger"
                  onClick={() => navigate("/disputes")} />
                <QuickAction icon={Shield} title="Verify Identity" description="Complete KYC" tone="warning"
                  onClick={() => navigate("/wallet")} />
              </div>
            </motion.div>

            {/* Reputation */}
            {reputation && (
              <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
                className="rounded-2xl p-4 border border-border bg-card">
                <div className="font-bold text-foreground text-sm mb-3">Trust Score</div>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 -rotate-90">
                      <circle cx="32" cy="32" r="26" stroke="rgb(var(--border) / 0.3)" strokeWidth="6" fill="none" />
                      <circle cx="32" cy="32" r="26" stroke="#08B95F" strokeWidth="6" fill="none"
                        strokeDasharray={`${2 * Math.PI * 26}`}
                        strokeDashoffset={`${2 * Math.PI * 26 * (1 - Math.min(reputation.score / 1000, 1))}`}
                        strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-black text-foreground">{reputation.score}</span>
                    </div>
                  </div>
                  <div>
                    <TrustBadge level={reputation.level} score={reputation.score} size="sm" showScore={false} />
                    <div className="text-xs text-muted mt-1">{reputation.completedTrades} trades completed</div>
                    <Link to="/reputation" className="text-xs font-semibold mt-1 block text-primary">
                      View details →
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Security status */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
              className="rounded-2xl p-4 border border-border bg-card">
              <div className="font-bold text-foreground text-sm mb-3">Security Status</div>
              <div className="space-y-2.5">
                {[
                  { label: "Email Verified", done: true },
                  { label: "Phone Number", done: !!user?.phone },
                  { label: "KYC Verified", done: user?.kyc_status === "verified" },
                  { label: "2FA Enabled", done: false },
                ].map(({ label, done }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">{label}</span>
                    <div className={`flex items-center gap-1 text-xs font-semibold ${done ? "text-success" : "text-disabled"}`}>
                      {done ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {done ? "Done" : "Pending"}
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/settings" className="mt-3 flex items-center justify-center gap-1 w-full py-2 rounded-xl text-xs font-semibold text-primary bg-primary/10 transition-all hover:opacity-80">
                <Zap className="w-3 h-3" /> Improve Security
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
