import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, Trade, Dispute, myTrades } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import { ArrowLeftRight, AlertTriangle, Wallet, Plus } from "lucide-react";
import StatusBadge from "@/components/trades/StatusBadge";
export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [trades, setTrades] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const u = await auth.me();
        setUser(u);
        const [t, d] = await Promise.all([myTrades(), Dispute.list()]);
        setTrades(t);
        setDisputes(d);
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, []);
  const fmt = (v) => "₦" + (Number(v) || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 });
  const activeTrades = trades.filter((t) => !["Confirmed", "Resolved", "Cancelled"].includes(t.status));
  const escrowTotal = activeTrades.reduce((s, t) => s + (Number(t.amount) || 0), 0);
  return (
    <AppLayout user={user}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-[#0D1F3C]">Welcome back, {user?.full_name?.split(" ")[0] || "there"} 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Here's your escrow overview.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Wallet Balance", value: fmt(user?.wallet_balance || 0), icon: Wallet, color: "#00A651" },
            { label: "Escrow Total", value: fmt(escrowTotal), icon: ArrowLeftRight, color: "#0D1F3C" },
            { label: "Active Trades", value: activeTrades.length, icon: ArrowLeftRight, color: "#163560" },
            { label: "Disputes", value: disputes.length, icon: AlertTriangle, color: "#dc2626" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: color + "15" }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div className="text-2xl font-black text-[#0D1F3C]">{value}</div>
              <div className="text-gray-400 text-xs mt-1">{label}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[#0D1F3C]">Recent Trades</h2>
          <Link to="/trades/new" className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-sm font-semibold" style={{ background: "#00A651" }}>
            <Plus className="w-4 h-4" /> New Trade
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" /></div>
        ) : trades.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
            <ArrowLeftRight className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No trades yet</p>
            <Link to="/trades/new" className="mt-3 inline-block text-sm font-semibold" style={{ color: "#00A651" }}>Create your first trade</Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-50">
              {trades.slice(0, 10).map((t) => (
                <Link key={t.id} to={`/trades/${t.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[#0D1F3C] text-sm truncate">{t.item_name}</div>
                    <div className="text-gray-400 text-xs">{t.reference} · {new Date(t.created_date).toLocaleDateString("en-NG")}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-sm text-[#0D1F3C]">{fmt(t.amount)}</div>
                    <StatusBadge status={t.status} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
