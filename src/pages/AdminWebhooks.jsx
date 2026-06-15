import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import { Activity, RefreshCw } from "lucide-react";

const statusColors = {
  success: "bg-green-50 text-green-600",
  failed: "bg-red-50 text-red-600",
  duplicate: "bg-amber-50 text-amber-600",
  ignored: "bg-gray-100 text-gray-500",
};

export default function AdminWebhooks() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const all = await base44.entities.WebhookEvent.list("-created_date", 100);
    setEvents(all);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      const u = await base44.auth.me();
      if (u?.role !== "admin") { window.location.href = "/dashboard"; return; }
      setUser(u);
      await load();
    })();
  }, []);

  return (
    <AppLayout user={user}>
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-[#0D1F3C]">Webhook Event Log</h1>
          <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-all">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" /></div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
            <Activity className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No webhook events yet</p>
            <p className="text-gray-400 text-sm mt-1">Events appear here when payment gateways send notifications.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">Timestamp</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">Gateway</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">Trade Ref</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">Amount</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">Event</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {events.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{new Date(e.created_date).toLocaleString("en-NG")}</td>
                    <td className="px-4 py-3 font-semibold text-[#0D1F3C]">{e.gateway}</td>
                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">{e.trade_reference || "—"}</td>
                    <td className="px-4 py-3 font-semibold text-[#0D1F3C]">{e.amount ? "₦" + e.amount.toLocaleString() : "—"}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{e.event_type}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[e.status] || statusColors.ignored}`}>{e.status}</span>
                    </td>
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