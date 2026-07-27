import React, { useEffect, useState } from "react";
import { auth, AdminAPI } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import { FileText, Search } from "lucide-react";

export default function AdminAuditLogs() {
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const u = await auth.me();
        setUser(u);
        const l = await AdminAPI.auditLogs();
        setLogs(l);
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, []);

  const filtered = logs.filter(l =>
    !search ||
    l.action?.toLowerCase().includes(search.toLowerCase()) ||
    l.admin_email?.toLowerCase().includes(search.toLowerCase()) ||
    l.entity_type?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout user={user}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-foreground mb-6">Audit Logs</h1>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
            placeholder="Search by action, admin, or entity..." />
        </div>
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border py-20 text-center">
            <FileText className="w-12 h-12 text-disabled mx-auto mb-4" />
            <p className="text-text-secondary">No audit logs yet</p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Action", "Entity", "Admin", "Date"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-muted uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(log => (
                  <tr key={log.id} className="hover:bg-card-hover transition-colors">
                    <td className="px-4 py-3 font-semibold text-foreground">{log.action}</td>
                    <td className="px-4 py-3">
                      {log.entity_type && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-info/10 text-info">{log.entity_type}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-text-secondary text-xs">{log.admin_email}</td>
                    <td className="px-4 py-3 text-muted text-xs">{new Date(log.created_date).toLocaleString("en-NG")}</td>
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
