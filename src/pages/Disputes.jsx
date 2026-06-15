import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import { AlertTriangle, ChevronRight } from "lucide-react";

const statusColors = {
  OPEN: { bg: "#fef2f2", color: "#dc2626", label: "Open" },
  UNDER_REVIEW: { bg: "#fffbeb", color: "#d97706", label: "Under Review" },
  RESOLVED: { bg: "#f0fdfa", color: "#0d9488", label: "Resolved" },
};

export default function Disputes() {
  const [user, setUser] = useState(null);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const u = await base44.auth.me();
      setUser(u);
      const d = await base44.entities.Dispute.filter({ raised_by_id: u.id }, "-created_date", 50);
      setDisputes(d);
      setLoading(false);
    })();
  }, []);

  return (
    <AppLayout user={user}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-[#0D1F3C] mb-6">My Disputes</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" />
          </div>
        ) : disputes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
            <AlertTriangle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No disputes raised</p>
            <p className="text-gray-400 text-sm mt-1">Disputes are raised from within a trade.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-50">
              {disputes.map((d) => {
                const sc = statusColors[d.status] || statusColors.OPEN;
                return (
                  <Link
                    key={d.id}
                    to={`/trades/${d.trade_id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[#0D1F3C] text-sm truncate">{d.description?.substring(0, 60)}...</div>
                      <div className="text-gray-400 text-xs mt-0.5">Ref: {d.trade_reference} · {new Date(d.created_date).toLocaleDateString("en-NG")}</div>
                    </div>
                    <div className="shrink-0">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}