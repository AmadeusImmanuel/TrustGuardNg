import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import StatusBadge from "@/components/trades/StatusBadge";
import { Plus, ArrowLeftRight, ChevronRight, Search } from "lucide-react";

const STATUSES = ["All", "Awaiting_Payment", "Funded", "Shipped", "Confirmed", "Disputed", "Resolved"];

export default function Trades() {
  const [user, setUser] = useState(null);
  const [trades, setTrades] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
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
            <div className="divide-y divide-gray-50">
              {filtered.map((trade) => (
                <Link
                  key={trade.id}
                  to={`/trades/${trade.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
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
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}