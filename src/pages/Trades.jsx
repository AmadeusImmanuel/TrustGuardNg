import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import StatusBadge from "@/components/trades/StatusBadge";
import { Plus, ArrowLeftRight, ChevronRight, Search, CheckSquare, Square, ChevronDown, Loader2 } from "lucide-react";

const STATUSES = ["All", "Awaiting_Payment", "Funded", "Shipped", "Confirmed", "Disputed", "Resolved"];

const BULK_ACTIONS = [
  { value: "Shipped", label: "Mark as Shipped" },
  { value: "Confirmed", label: "Mark as Confirmed" },
  { value: "Resolved", label: "Mark as Resolved" },
];

export default function Trades() {
  const [user, setUser] = useState(null);
  const [trades, setTrades] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set());
  const [bulkAction, setBulkAction] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);
  const [showBulkMenu, setShowBulkMenu] = useState(false);

  useEffect(() => {
    (async () => {
      const u = await base44.auth.me();
      setUser(u);
      const all = await base44.entities.Trade.list("-created_date", 100);
      setTrades(all.filter((t) => t.buyer_id === u.id || t.seller_id === u.id));
      setLoading(false);
    })();
  }, []);

  const filtered = trades.filter((t) => {
    const matchStatus = filter === "All" || t.status === filter;
    const matchSearch =
      !search ||
      t.item_name?.toLowerCase().includes(search.toLowerCase()) ||
      t.reference?.toLowerCase().includes(search.toLowerCase()) ||
      t.seller_email?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const allSelected = filtered.length > 0 && filtered.every((t) => selected.has(t.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((t) => t.id)));
    }
  };

  const toggleOne = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const applyBulkAction = async (action) => {
    if (!action || selected.size === 0) return;
    setBulkLoading(true);
    setShowBulkMenu(false);
    try {
      await Promise.all(
        [...selected].map((id) =>
          base44.entities.Trade.update(id, { status: action })
        )
      );
      // Refresh trades
      const u = user;
      const all = await base44.entities.Trade.list("-created_date", 100);
      setTrades(all.filter((t) => t.buyer_id === u.id || t.seller_id === u.id));
      setSelected(new Set());
      setBulkAction("");
    } catch (err) {
      console.error(err);
    }
    setBulkLoading(false);
  };

  return (
    <AppLayout user={user}>
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-black text-[#0D1F3C]">My Trades</h1>
          <Link
            to="/trades/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-semibold text-sm shadow-sm hover:opacity-90"
            style={{ background: "#00A651" }}
          >
            <Plus className="w-4 h-4" />
            New Trade
          </Link>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search trades..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#0D1F3C] bg-white focus:outline-none focus:border-green-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  filter === s ? "text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
                style={filter === s ? { background: "#0D1F3C" } : {}}
              >
                {s.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selected.size > 0 && (
          <div className="flex items-center gap-3 bg-[#0D1F3C] text-white px-4 py-3 rounded-xl mb-4 text-sm">
            <span className="font-semibold">{selected.size} selected</span>
            <div className="flex-1" />
            <div className="relative">
              <button
                onClick={() => setShowBulkMenu((v) => !v)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all"
                style={{ background: "#00A651" }}
              >
                Apply Action <ChevronDown className="w-4 h-4" />
              </button>
              {showBulkMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-20 min-w-[180px] overflow-hidden">
                  {BULK_ACTIONS.map((a) => (
                    <button
                      key={a.value}
                      onClick={() => applyBulkAction(a.value)}
                      className="w-full text-left px-4 py-3 text-sm text-[#0D1F3C] hover:bg-gray-50 font-medium"
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {bulkLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <button
              onClick={() => setSelected(new Set())}
              className="text-white/60 hover:text-white text-xs"
            >
              Clear
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
            <ArrowLeftRight className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No trades found</p>
            <Link
              to="/trades/new"
              className="inline-block mt-4 px-5 py-2 rounded-full text-white text-sm font-semibold"
              style={{ background: "#00A651" }}
            >
              Start a Trade
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Select All header */}
            <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-50 bg-gray-50/50">
              <button onClick={toggleAll} className="text-gray-400 hover:text-[#0D1F3C] transition-colors">
                {allSelected ? (
                  <CheckSquare className="w-4 h-4 text-[#00A651]" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
              </button>
              <span className="text-xs text-gray-400 font-medium">Select all visible</span>
            </div>

            <div className="divide-y divide-gray-50">
              {filtered.map((trade) => (
                <div key={trade.id} className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors">
                  {/* Checkbox */}
                  <button
                    onClick={(e) => toggleOne(trade.id, e)}
                    className="text-gray-300 hover:text-[#0D1F3C] transition-colors shrink-0"
                  >
                    {selected.has(trade.id) ? (
                      <CheckSquare className="w-4 h-4 text-[#00A651]" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>

                  {/* Trade row as link */}
                  <Link
                    to={`/trades/${trade.id}`}
                    className="flex items-center gap-4 flex-1 min-w-0"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#f0f4ff] flex items-center justify-center shrink-0">
                      <ArrowLeftRight className="w-5 h-5 text-[#0D1F3C]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[#0D1F3C] text-sm truncate">{trade.item_name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-gray-400 text-xs">
                          {trade.buyer_id === user?.id ? "You're buying" : "You're selling"}
                        </span>
                        {trade.reference && (
                          <span className="text-gray-300 text-xs">· {trade.reference}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-[#0D1F3C] text-sm">₦{(trade.amount || 0).toLocaleString()}</div>
                      <div className="mt-1">
                        <StatusBadge status={trade.status} />
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}