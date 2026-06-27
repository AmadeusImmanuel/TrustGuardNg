import React, { useEffect, useState } from "react";
import { auth, Trade } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import { Search } from "lucide-react";
import StatusBadge from "@/components/trades/StatusBadge";
export default function AdminAllTrades() {
  const [user, setUser] = useState(null);
  const [trades, setTrades] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [bulkStatus, setBulkStatus] = useState("");
  useEffect(() => {
    (async () => {
      try {
        const u = await auth.me();
        setUser(u);
        const all = await Trade.list();
        setTrades(all);
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, []);
  const filtered = trades.filter((t) => {
    const ms = !search || t.item_name?.toLowerCase().includes(search.toLowerCase()) || t.reference?.toLowerCase().includes(search.toLowerCase());
    const mf = filter === "all" || t.status === filter;
    return ms && mf;
  });
  const toggle = (id) => { const s = new Set(selected); s.has(id) ? s.delete(id) : s.add(id); setSelected(s); };
  const applyBulk = async () => {
    if (!bulkStatus || selected.size === 0) return;
    await Promise.all([...selected].map((id) => Trade.update(id, { status: bulkStatus })));
    const all = await Trade.list();
    setTrades(all);
    setSelected(new Set());
  };
  const fmt = (v) => "₦" + (Number(v) || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 });
  const statuses = ["all", "Awaiting_Payment", "Funded", "Shipped", "Confirmed", "Disputed", "Resolved"];
  return (
    <AppLayout user={user}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-[#0D1F3C] mb-6">All Trades</h1>
        <div className="flex gap-3 mb-4 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" placeholder="Search..." />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white">
            {statuses.map((s) => <option key={s} value={s}>{s === "all" ? "All" : s.replace("_", " ")}</option>)}
          </select>
          {selected.size > 0 && (
            <div className="flex gap-2">
              <select value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value)} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white">
                <option value="">Bulk status...</option>
                {statuses.filter((s) => s !== "all").map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
              </select>
              <button onClick={applyBulk} className="px-4 py-2.5 rounded-xl text-white text-sm font-semibold" style={{ background: "#00A651" }}>Apply to {selected.size}</button>
            </div>
          )}
        </div>
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" /></div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100">{["", "Reference", "Item", "Amount", "Status", "Date"].map((h) => <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3"><input type="checkbox" checked={selected.has(t.id)} onChange={() => toggle(t.id)} className="rounded" /></td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{t.reference}</td>
                    <td className="px-4 py-3 font-semibold text-[#0D1F3C] max-w-xs truncate">{t.item_name}</td>
                    <td className="px-4 py-3 font-bold text-[#0D1F3C]">{fmt(t.amount)}</td>
                    <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(t.created_date).toLocaleDateString("en-NG")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
