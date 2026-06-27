import React, { useEffect, useState } from "react";
import { auth, User, Trade, Dispute, WebhookEvent, Transaction } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import { Users, ArrowLeftRight, AlertTriangle, Webhook } from "lucide-react";
import DailyEscrowVolumeChart from "@/components/admin/DailyEscrowVolumeChart";
import TradeVolumeChart from "@/components/admin/TradeVolumeChart";
import DisputeRateChart from "@/components/admin/DisputeRateChart";
import TransactionTrendChart from "@/components/admin/TransactionTrendChart";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [trades, setTrades] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ users: 0, trades: 0, disputes: 0, webhooks: 0, volume: 0, fees: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const u = await auth.me();
        setUser(u);
        const [users, allTrades, allDisputes, webhooks, txns] = await Promise.all([
          User.list(), Trade.list(), Dispute.list(), WebhookEvent.list(), Transaction.list(),
        ]);
        setTrades(allTrades);
        setDisputes(allDisputes);
        setTransactions(txns);
        setStats({
          users: users.length, trades: allTrades.length, disputes: allDisputes.length, webhooks: webhooks.length,
          volume: allTrades.reduce((s, t) => s + (Number(t.amount) || 0), 0),
          fees: allTrades.reduce((s, t) => s + (Number(t.calculated_fee) || 0), 0),
        });
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, []);

  const fmt = (v) => "₦" + (Number(v) || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 });
  const cards = [
    { label: "Total Users", value: stats.users, icon: Users, color: "#0D1F3C" },
    { label: "Total Trades", value: stats.trades, icon: ArrowLeftRight, color: "#163560" },
    { label: "Disputes", value: stats.disputes, icon: AlertTriangle, color: "#dc2626" },
    { label: "Webhooks", value: stats.webhooks, icon: Webhook, color: "#7c3aed" },
    { label: "Total Volume", value: fmt(stats.volume), icon: ArrowLeftRight, color: "#00A651" },
    { label: "Fees Collected", value: fmt(stats.fees), icon: ArrowLeftRight, color: "#059669" },
  ];

  return (
    <AppLayout user={user}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-[#0D1F3C] mb-8">Admin Dashboard</h1>
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" /></div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {cards.map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: color + "15" }}>
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div className="text-3xl font-black text-[#0D1F3C]">{value}</div>
                  <div className="text-gray-400 text-sm mt-1">{label}</div>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              <DailyEscrowVolumeChart trades={trades} />
              <div className="grid lg:grid-cols-2 gap-6">
                <TradeVolumeChart trades={trades} />
                <DisputeRateChart trades={trades} disputes={disputes} />
              </div>
              <TransactionTrendChart transactions={transactions} />
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
