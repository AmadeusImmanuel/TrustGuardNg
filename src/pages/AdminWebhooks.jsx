import React, { useEffect, useState } from "react";
import { auth, WebhookEvent } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
export default function AdminWebhooks() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const u = await auth.me();
        setUser(u);
        const all = await WebhookEvent.list();
        setEvents(all);
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, []);
  const statusColors = { received: "#059669", processed: "#2563eb", failed: "#dc2626" };
  return (
    <AppLayout user={user}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-[#0D1F3C] mb-6">Webhook Events</h1>
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" /></div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center"><p className="text-gray-400">No webhook events yet.</p></div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100">{["Event Type", "Source", "Status", "Retries", "Date"].map((h) => <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-gray-50">
                {events.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-[#0D1F3C]">{e.event_type}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{e.source || "—"}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: (statusColors[e.status] || "#6b7280") + "20", color: statusColors[e.status] || "#6b7280" }}>{e.status}</span></td>
                    <td className="px-4 py-3 text-gray-500">{e.retries}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(e.created_date).toLocaleDateString("en-NG")}</td>
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
