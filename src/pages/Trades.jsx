import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, Trade, myTrades } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import { Search, ChevronRight } from "lucide-react";
import StatusBadge from "@/components/trades/StatusBadge";

export default function Trades() {
  const [user, setUser] = useState(null);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    (async () => {
      try {
        const u = await auth.me();
        setUser(u);
        const all = await myTrades();
        setTrades(all);
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, []);

  const statuses = ["all", "Awaiting_Payment", "Funded", "Shipped", "Confirmed", "Disputed", "Resolved"];

  const filtered = trades.filter((t) => {
    const matchSearch = !search || t.item_name?.toLowerCase().includes(search.toLowerCase()) || t.reference?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || t.status === filter;
    return matchSearch && matchFilter;
  });

  const fmt = (v) => "₦" + (Number(v) || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 });

  return (
    <AppLayout user={user}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-[#0D1F3C]">My Trades</h1>
          <Link to="/trades/new" className="px-5 py-2.5 rounded-full text-white font-semibold text-sm" style={{ background: "#00A651" }}>
            + New Trade
          </Link>
        </div>
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500"
              placeholder="Search trades..." />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500 bg-white">
            {statuses.map((s) => <option key={s} value={s}>{s === "all" ? "All Status" : s.replace("_", " ")}</option>)}
          </select>
        </div>
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
            <p className="text-gray-500 font-medium">No trades found</p>
            <Link to="/trades/new" className="mt-3 inline-block text-sm font-semibold" style={{ color: "#00A651" }}>Create your first trade</Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-50">
              {filtered.map((t) => (
                <Link key={t.id} to={`/trades/${t.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[#0D1F3C] text-sm truncate">{t.item_name}</div>
                    <div className="text-gray-400 text-xs mt-0.5">Ref: {t.reference} · {new Date(t.created_date).toLocaleDateString("en-NG")}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-[#0D1F3C] text-sm">{fmt(t.amount)}</div>
                    <StatusBadge status={t.status} />
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
