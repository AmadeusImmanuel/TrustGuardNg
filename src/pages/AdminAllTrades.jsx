import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import StatusBadge from "@/components/trades/StatusBadge";
import { Search, ChevronRight } from "lucide-react";

const STATUSES = ["All", "Awaiting_Payment", "Funded", "Shipped", "Confirmed", "Disputed", "Resolved"];

export default function AdminAllTrades() {
  const [user, setUser] = useState(null);
  const [trades, setTrades] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const u = await base44.auth.me();
      if (u?.role !== "admin") { window.location.href = "/dashboard"; return; }
      setUser(u);
      const all = await base44.entities.Trade.list("-created_date", 200);
      setTrades(all);
      setLoading(false);
    })();
  }, []);

  const filtered = trades.filter((t) => {
    const matchStatus = filter === "All" || t.status === filter;
    const matchSearch = !search || t.item_name?.toLowerCase().includes(search.toLowerCase()) || t.reference?.toLowerCase().includes(search.toLowerCase()) || t.buyer_email?.toLowerCase().includes(search.toLowerCase()) || t.seller_email?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <AppLayout user={user}>
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        <h1 className="text-2xl font-black text-[#0D1F3C] mb-6">All Trades</h1>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search trades..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-green-500" />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {STATUSES.map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${filter === s ? "text-white" : "bg-white border border-gray-200 text-gray-500"}`}
                style={filter === s ? { background: "#0D1F3C" } : {}}>
                {s.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" /></div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">Reference</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">Item</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">Buyer</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">Amount</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">Status</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{t.reference}</td>
                    <td className="px-4 py-3 font-semibold text-[#0D1F3C] max-w-[160px] truncate">{t.item_name}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{t.buyer_email}</td>
                    <td className="px-4 py-3 font-bold text-[#0D1F3C]">₦{(t.amount || 0).toLocaleString()}</td>
                    <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                    <td className="px-4 py-3">
                      <Link to={`/trades/${t.id}`} className="text-gray-400 hover:text-gray-700">
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-gray-400 text-sm">No trades found</div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}