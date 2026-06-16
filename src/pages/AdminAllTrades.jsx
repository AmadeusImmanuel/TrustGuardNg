import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import StatusBadge from "@/components/trades/StatusBadge";
import { Search, ChevronRight, CheckSquare, Square, ChevronDown, Loader2 } from "lucide-react";

const STATUSES = ["All", "Awaiting_Payment", "Funded", "Shipped", "Confirmed", "Disputed", "Resolved"];

const BULK_ACTIONS = [
  { value: "Funded", label: "Approve — Mark as Funded" },
  { value: "Shipped", label: "Mark as Shipped" },
  { value: "Confirmed", label: "Mark as Confirmed" },
  { value: "Resolved", label: "Mark as Resolved" },
  { value: "Disputed", label: "Flag as Disputed" },
];

export default function AdminAllTrades() {
  const [user, setUser] = useState(null);
  const [trades, setTrades] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set());
  const [showBulkMenu, setShowBulkMenu] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

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
    const matchSearch = !search ||
      t.item_name?.toLowerCase().includes(search.toLowerCase()) ||
      t.reference?.toLowerCase().includes(search.toLowerCase()) ||
      t.buyer_email?.toLowerCase().includes(search.toLowerCase()) ||
      t.seller_email?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const allSelected = filtered.length > 0 && filtered.every((t) => selected.has(t.id));

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(filtered.map((t) => t.id)));
  };

  const toggleOne = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const applyBulkAction = async (newStatus) => {
    if (!newStatus || selected.size === 0) return;
    setBulkLoading(true);
    setShowBulkMenu(false);
    await Promise.all([...selected].map((id) => base44.entities.Trade.update(id, { status: newStatus })));
    const all = await base44.entities.Trade.list("-created_date", 200);
    setTrades(all);
    setSelected(new Set());
    setBulkLoading(false);
    setSuccessMsg(`${selected.size} trades updated to "${newStatus.replace(/_/g, " ")}"`);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <AppLayout user={user}>
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-[#0D1F3C]">All Trades</h1>
          {selected.size > 0 && (
            <span className="text-sm text-gray-500">{selected.size} selected</span>
          )}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search trades..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-green-500" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {STATUSES.map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${filter === s ? "text-white" : "bg-white border border-gray-200 text-gray-500"}`}
                style={filter === s ? { background: "#0D1F3C" } : {}}>
                {s.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Success Message */}
        {successMsg && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium text-white" style={{ background: "#00A651" }}>
            ✓ {successMsg}
          </div>
        )}

        {/* Bulk Action Bar */}
        {selected.size > 0 && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-4 text-white text-sm" style={{ background: "#0D1F3C" }}>
            <span className="font-semibold">{selected.size} trade{selected.size > 1 ? "s" : ""} selected</span>
            <div className="flex-1" />
            {bulkLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <div className="relative">
              <button
                onClick={() => setShowBulkMenu((v) => !v)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ background: "#00A651" }}
              >
                Bulk Update <ChevronDown className="w-4 h-4" />
              </button>
              {showBulkMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-20 min-w-[220px] overflow-hidden">
                  {BULK_ACTIONS.map((a) => (
                    <button key={a.value} onClick={() => applyBulkAction(a.value)}
                      className="w-full text-left px-4 py-3 text-sm text-[#0D1F3C] hover:bg-gray-50 font-medium border-b border-gray-50 last:border-0">
                      {a.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setSelected(new Set())} className="text-white/60 hover:text-white text-xs">
              Clear
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 w-10">
                    <button onClick={toggleAll} className="text-gray-400 hover:text-[#0D1F3C] transition-colors">
                      {allSelected
                        ? <CheckSquare className="w-4 h-4 text-[#00A651]" />
                        : <Square className="w-4 h-4" />}
                    </button>
                  </th>
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
                  <tr key={t.id} className={`hover:bg-gray-50 transition-colors ${selected.has(t.id) ? "bg-green-50/40" : ""}`}>
                    <td className="px-4 py-3 w-10">
                      <button onClick={() => toggleOne(t.id)} className="text-gray-300 hover:text-[#0D1F3C] transition-colors">
                        {selected.has(t.id)
                          ? <CheckSquare className="w-4 h-4 text-[#00A651]" />
                          : <Square className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{t.reference}</td>
                    <td className="px-4 py-3 font-semibold text-[#0D1F3C] max-w-[160px] truncate">{t.item_name}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{t.buyer_email}</td>
                    <td className="px-4 py-3 font-bold text-[#0D1F3C]">₦{(t.amount || 0).toLocaleString()}</td>
                    <td className="px-4 py-4"><StatusBadge status={t.status} /></td>
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