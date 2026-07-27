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

  const statusClass = {
    received: "bg-success/10 text-success",
    processed: "bg-info/10 text-info",
    failed: "bg-danger/10 text-danger",
  };

  return (
    <AppLayout user={user}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-foreground mb-6">Webhook Events</h1>
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" /></div>
        ) : events.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border py-20 text-center"><p className="text-muted">No webhook events yet.</p></div>
        ) : (
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border">{["Event Type", "Source", "Status", "Retries", "Date"].map((h) => <th key={h} className="text-left px-4 py-3 text-xs font-bold text-muted uppercase">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-border">
                {events.map((e) => (
                  <tr key={e.id} className="hover:bg-card-hover transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-foreground">{e.event_type}</td>
                    <td className="px-4 py-3 text-text-secondary text-xs">{e.source || "—"}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusClass[e.status] || "bg-card-hover text-muted"}`}>{e.status}</span></td>
                    <td className="px-4 py-3 text-text-secondary">{e.retries}</td>
                    <td className="px-4 py-3 text-muted text-xs">{new Date(e.created_date).toLocaleDateString("en-NG")}</td>
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
