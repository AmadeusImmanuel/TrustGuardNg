import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import StatusBadge from "@/components/trades/StatusBadge";
import { ArrowLeftRight, Wallet, AlertTriangle, TrendingUp, Plus, ChevronRight } from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [trades, setTrades] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const u = await base44.auth.me();
      setUser(u);
      const [t, d] = await Promise.all([
        base44.entities.Trade.list("-created_date", 50),
        base44.entities.Dispute.list("-created_date", 10),
      ]);
      const myTrades = t.filter(
        (tr) => tr.buyer_id === u.id || tr.seller_id === u.id
      );
      setTrades(myTrades.slice(0, 5));
      setDisputes(d.filter((d) => d.raised_by_id === u.id).slice(0, 3));
      setLoading(false);
    })();
  }, []);

  const balance = user?.wallet_balance || 0;
  const pending = user?.pending_escrow || 0;

  const fmt = (v) =>
    "₦" + (v || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 });

  const stats = [
    {
      label: "Wallet Balance",
      value: fmt(balance),
      icon: Wallet,
      color: "#00A651",
      bg: "#f0fff7",
      to: "/wallet",
    },
    {
      label: "Pending Escrow",
      value: fmt(pending),
      icon: TrendingUp,
      color: "#2563eb",
      bg: "#eff6ff",
      to: "/trades",
    },
    {
      label: "Active Trades",
      value: trades.filter((t) => !["Confirmed", "Resolved"].includes(t.status)).length,
      icon: ArrowLeftRight,
      color: "#d97706",
      bg: "#fffbeb",
      to: "/trades",
    },
    {
      label: "Open Disputes",
      value: disputes.filter((d) => d.status !== "RESOLVED").length,
      icon: AlertTriangle,
      color: "#dc2626",
      bg: "#fef2f2",
      to: "/disputes",
    },
  ];

  if (loading) {
    return (
      <AppLayout user={user}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={user}>
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-[#0D1F3C]">
              Good day, {user?.full_name?.split(" ")[0]} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">Here's your trading overview</p>
          </div>
          <Link
            to="/trades/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-semibold text-sm shadow-sm hover:opacity-90 transition-all"
            style={{ background: "#00A651" }}
          >
            <Plus className="w-4 h-4" />
            New Trade
          </Link>
        </div>

        {/* KYC Banner */}
        {user?.kyc_status !== "Verified" && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-amber-800 font-semibold text-sm">Identity Verification Required</p>
              <p className="text-amber-700 text-xs mt-0.5">
                Verify your NIN or BVN to unlock wallet withdrawals.
              </p>
            </div>
            <Link to="/wallet" className="text-amber-700 text-xs font-semibold hover:underline shrink-0">
              Verify →
            </Link>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <Link
              key={s.label}
              to={s.to}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all hover:-translate-y-0.5 group"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: s.bg }}
              >
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <div className="text-xl font-black text-[#0D1F3C]">{s.value}</div>
              <div className="text-gray-500 text-xs mt-1">{s.label}</div>
            </Link>
          ))}
        </div>

        {/* Recent Trades */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="font-bold text-[#0D1F3C]">Recent Trades</h2>
            <Link to="/trades" className="text-sm font-semibold" style={{ color: "#00A651" }}>
              View all →
            </Link>
          </div>
          {trades.length === 0 ? (
            <div className="py-16 text-center">
              <ArrowLeftRight className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium text-sm">No trades yet</p>
              <p className="text-gray-400 text-xs mt-1">Start by creating your first trade</p>
              <Link
                to="/trades/new"
                className="inline-block mt-4 px-5 py-2 rounded-full text-white text-sm font-semibold"
                style={{ background: "#00A651" }}
              >
                Create Trade
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {trades.map((trade) => (
                <Link
                  key={trade.id}
                  to={`/trades/${trade.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[#0D1F3C] text-sm truncate">{trade.item_name}</div>
                    <div className="text-gray-400 text-xs mt-0.5">
                      {trade.buyer_id === user?.id ? `Seller: ${trade.seller_name || trade.seller_email}` : `Buyer: ${trade.buyer_name || trade.buyer_email}`}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-[#0D1F3C] text-sm">₦{(trade.amount || 0).toLocaleString()}</div>
                    <StatusBadge status={trade.status} />
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}