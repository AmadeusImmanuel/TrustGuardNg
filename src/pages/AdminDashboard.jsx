import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import TradeVolumeChart from "@/components/admin/TradeVolumeChart";
import DisputeRateChart from "@/components/admin/DisputeRateChart";
import TransactionTrendChart from "@/components/admin/TransactionTrendChart";
import { Users, ArrowLeftRight, AlertTriangle, Wallet, TrendingUp, Activity } from "lucide-react";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ users: 0, trades: 0, disputes: 0, webhooks: 0, volume: 0, fees: 0 });
  const [trades, setTrades] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const u = await base44.auth.me();
      if (u?.role !== "admin") { window.location.href = "/dashboard"; return; }
      setUser(u);
      const [users, tradesData, disputesData, webhooks, txns] = await Promise.all([
        base44.entities.User.list(),
        base44.entities.Trade.list("-created_date", 200),
        base44.entities.Dispute.list("-created_date", 200),
        base44.entities.WebhookEvent.list(),
        base44.entities.Transaction.list("-created_date", 200),
      ]);
      const volume = tradesData.reduce((s, t) => s + (t.amount || 0), 0);
      const fees = txns.reduce((s, t) => s + (t.fee_collected || 0), 0);
      setStats({ users: users.length, trades: tradesData.length, disputes: disputesData.length, webhooks: webhooks.length, volume, fees });
      setTrades(tradesData);
      setDisputes(disputesData);
      setTransactions(txns);
      setLoading(false);
    })();
  }, []);

  const fmt = (v) => "₦" + (v || 0).toLocaleString("en-NG", { minimumFractionDigits: 0 });

  const cards = [
    { label: "Total Users", value: stats.users, icon: Users, color: "#0D1F3C", bg: "#f0f4ff", to: "/admin/users" },
    { label: "Total Trades", value: stats.trades, icon: ArrowLeftRight, color: "#2563eb", bg: "#eff6ff", to: "/admin/trades" },
    { label: "Open Disputes", value: stats.disputes, icon: AlertTriangle, color: "#dc2626", bg: "#fef2f2", to: "/admin/disputes" },
    { label: "Webhook Events", value: stats.webhooks, icon: Activity, color: "#d97706", bg: "#fffbeb", to: "/admin/webhooks" },
    { label: "Total Volume", value: fmt(stats.volume), icon: Wallet, color: "#00A651", bg: "#f0fff7", to: "/admin/trades" },
    { label: "Fees Collected", value: fmt(stats.fees), icon: TrendingUp, color: "#0d9488", bg: "#f0fdfa", to: "/admin/trades" },
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
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-3" style={{ background: "#00A651" }}>
            Admin
          </div>
          <h1 className="text-2xl font-black text-[#0D1F3C]">Platform Overview</h1>
          <p className="text-gray-500 text-sm mt-1">TrustGuard Nigeria admin dashboard</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {cards.map((c) => (
            <Link
              key={c.label}
              to={c.to}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: c.bg }}>
                <c.icon className="w-5 h-5" style={{ color: c.color }} />
              </div>
              <div className="text-xl font-black text-[#0D1F3C]">{c.value}</div>
              <div className="text-gray-500 text-xs mt-1">{c.label}</div>
            </Link>
          ))}
        </div>

        {/* Charts */}
        <div className="mb-6">
          <TradeVolumeChart trades={trades} />
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <DisputeRateChart trades={trades} disputes={disputes} />
          <TransactionTrendChart transactions={transactions} />
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link to="/admin/disputes" className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all">
            <h3 className="font-bold text-[#0D1F3C] mb-1">Dispute Center</h3>
            <p className="text-gray-500 text-sm">Review and resolve trade disputes between buyers and sellers.</p>
          </Link>
          <Link to="/admin/webhooks" className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all">
            <h3 className="font-bold text-[#0D1F3C] mb-1">Webhook Event Log</h3>
            <p className="text-gray-500 text-sm">Monitor payment gateway pings and debug dropped-network events.</p>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}