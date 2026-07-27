import React, { useEffect, useState } from "react";
import { auth, User, Trade, Dispute, WebhookEvent, Transaction } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import { motion } from "framer-motion";
import MetricCard from "@/components/ui/MetricCard";
import { Users, ArrowLeftRight, AlertTriangle, Webhook, TrendingUp, DollarSign } from "lucide-react";
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
          users: users.length, trades: allTrades.length,
          disputes: allDisputes.length, webhooks: webhooks.length,
          volume: allTrades.reduce((s, t) => s + (Number(t.amount) || 0), 0),
          fees: allTrades.reduce((s, t) => s + (Number(t.calculated_fee) || 0), 0),
        });
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, []);

  const fmt = (v) => "₦" + (Number(v) || 0).toLocaleString("en-NG", { minimumFractionDigits: 0 });

  return (
    <AppLayout user={user}>
      <div className="px-4 lg:px-8 py-6 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-black text-foreground">Admin Dashboard</h1>
          <p className="text-muted text-sm mt-1">Platform overview and analytics</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <MetricCard icon={Users} label="Total Users" value={stats.users} description="Registered accounts" tone="primary" delay={0} />
              <MetricCard icon={ArrowLeftRight} label="Total Trades" value={stats.trades} description="All time" tone="info" delay={0.05} />
              <MetricCard icon={AlertTriangle} label="Disputes" value={stats.disputes} description="Raised by users" tone="danger" delay={0.1} />
              <MetricCard icon={Webhook} label="Webhooks" value={stats.webhooks} description="Payment events" tone="info" delay={0.15} />
              <MetricCard icon={TrendingUp} label="Total Volume" value={fmt(stats.volume)} description="Escrow processed" tone="primary" delay={0.2} />
              <MetricCard icon={DollarSign} label="Fees Collected" value={fmt(stats.fees)} description="Platform revenue" tone="warning" delay={0.25} />
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
