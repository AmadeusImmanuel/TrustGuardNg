import React, { useEffect, useState } from "react";
import { auth, FraudAPI } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import { AlertTriangle, Shield, XCircle, CheckCircle, Plus, Trash2, RefreshCw } from "lucide-react";

const SEVERITY_STYLES = {
  low:    { className: "bg-success/10 text-success", label: "Low" },
  medium: { className: "bg-warning/10 text-warning", label: "Medium" },
  high:   { className: "bg-danger/10 text-danger", label: "High" },
};

const RISK_CONFIG = {
  low:    { emoji: "🟢" },
  medium: { emoji: "🟡" },
  high:   { emoji: "🔴" },
};

export default function AdminFraud() {
  const [user, setUser] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [blacklist, setBlacklist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("alerts");
  const [newEntry, setNewEntry] = useState({ type: "email", value: "", reason: "" });
  const [adding, setAdding] = useState(false);
  const [recalculating, setRecalculating] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const u = await auth.me();
        setUser(u);
        const [a, b] = await Promise.all([FraudAPI.fraudAlerts(), FraudAPI.blacklist()]);
        setAlerts(a);
        setBlacklist(b);
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, []);

  const resolveAlert = async (id) => {
    try {
      await FraudAPI.resolveAlert(id);
      setAlerts(alerts.map(a => a.id === id ? { ...a, resolved: true } : a));
    } catch (err) { alert(err.message); }
  };

  const addToBlacklist = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const entry = await FraudAPI.addBlacklist(newEntry);
      setBlacklist([entry, ...blacklist]);
      setNewEntry({ type: "email", value: "", reason: "" });
    } catch (err) { alert(err.message); }
    setAdding(false);
  };

  const removeFromBlacklist = async (id) => {
    try {
      await FraudAPI.removeBlacklist(id);
      setBlacklist(blacklist.filter(b => b.id !== id));
    } catch (err) { alert(err.message); }
  };

  const recalculate = async () => {
    setRecalculating(true);
    try {
      const result = await FraudAPI.recalculateRisk();
      alert(result.message);
    } catch (err) { alert(err.message); }
    setRecalculating(false);
  };

  const activeAlerts = alerts.filter(a => !a.resolved);
  const resolvedAlerts = alerts.filter(a => a.resolved);

  return (
    <AppLayout user={user}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-foreground">Fraud Prevention</h1>
            <p className="text-muted text-sm mt-1">{activeAlerts.length} active alerts · {blacklist.length} blacklisted entries</p>
          </div>
          <button onClick={recalculate} disabled={recalculating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border text-sm font-semibold text-text-secondary hover:bg-card-hover disabled:opacity-60 transition-colors">
            <RefreshCw className={`w-4 h-4 ${recalculating ? "animate-spin" : ""}`} />
            {recalculating ? "Recalculating..." : "Recalculate Risk Scores"}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Active Alerts", value: activeAlerts.length, tone: "text-danger bg-danger/10", icon: AlertTriangle },
            { label: "Resolved Alerts", value: resolvedAlerts.length, tone: "text-success bg-success/10", icon: CheckCircle },
            { label: "Blacklisted", value: blacklist.length, tone: "text-info bg-info/10", icon: XCircle },
          ].map(({ label, value, tone, icon: Icon }) => (
            <div key={label} className="bg-card rounded-2xl border border-border p-5 text-center">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 ${tone}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-foreground">{value}</div>
              <div className="text-muted text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: "alerts", label: `Fraud Alerts (${activeAlerts.length})` },
            { key: "blacklist", label: `Blacklist (${blacklist.length})` },
            { key: "resolved", label: `Resolved (${resolvedAlerts.length})` },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === key ? "text-primary-foreground bg-foreground" : "bg-card-hover text-text-secondary"}`}>
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" /></div>
        ) : (
          <>
            {/* Fraud Alerts */}
            {activeTab === "alerts" && (
              <div className="space-y-4">
                {activeAlerts.length === 0 ? (
                  <div className="bg-card rounded-2xl border border-border py-16 text-center">
                    <Shield className="w-12 h-12 text-disabled mx-auto mb-3" />
                    <p className="text-text-secondary font-medium">No active fraud alerts</p>
                    <p className="text-muted text-sm mt-1">All users are within normal risk parameters.</p>
                  </div>
                ) : activeAlerts.map(alert => {
                  const sc = SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.medium;
                  const rc = RISK_CONFIG[alert.risk_level] || RISK_CONFIG.low;
                  return (
                    <div key={alert.id} className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${sc.className}`}>
                            <AlertTriangle className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-foreground">{alert.alert_type}</div>
                            <div className="text-muted text-sm">{alert.email} · {alert.full_name}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{rc.emoji}</span>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${sc.className}`}>
                            {sc.label} Risk
                          </span>
                        </div>
                      </div>
                      <div className="bg-card-hover rounded-xl p-4 mb-4">
                        <div className="text-xs text-muted mb-1">Flags</div>
                        <p className="text-sm text-text-secondary">{alert.description}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted">{new Date(alert.created_date).toLocaleString("en-NG")}</div>
                        <div className="flex gap-2">
                          <button onClick={() => resolveAlert(alert.id)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-primary-foreground text-xs font-semibold bg-primary hover:bg-primary-hover transition-colors">
                            <CheckCircle className="w-3 h-3" /> Mark Resolved
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Blacklist */}
            {activeTab === "blacklist" && (
              <div>
                {/* Add to blacklist form */}
                <div className="bg-card rounded-2xl border border-border p-6 mb-6">
                  <h2 className="font-bold text-foreground mb-4">Add to Blacklist</h2>
                  <form onSubmit={addToBlacklist} className="flex gap-3 flex-wrap">
                    <select value={newEntry.type} onChange={e => setNewEntry({ ...newEntry, type: e.target.value })}
                      className="px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none bg-background text-foreground">
                      <option value="email">Email</option>
                      <option value="ip">IP Address</option>
                      <option value="phone">Phone</option>
                    </select>
                    <input required value={newEntry.value} onChange={e => setNewEntry({ ...newEntry, value: e.target.value })}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                      placeholder="Email, IP, or phone to blacklist..." />
                    <input value={newEntry.reason} onChange={e => setNewEntry({ ...newEntry, reason: e.target.value })}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                      placeholder="Reason (optional)" />
                    <button type="submit" disabled={adding}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60 bg-danger hover:opacity-90 transition-opacity">
                      <Plus className="w-4 h-4" /> {adding ? "Adding..." : "Add"}
                    </button>
                  </form>
                </div>

                {blacklist.length === 0 ? (
                  <div className="bg-card rounded-2xl border border-border py-16 text-center">
                    <XCircle className="w-12 h-12 text-disabled mx-auto mb-3" />
                    <p className="text-text-secondary">Blacklist is empty</p>
                  </div>
                ) : (
                  <div className="bg-card rounded-2xl border border-border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead><tr className="border-b border-border">{["Type", "Value", "Reason", "Date", ""].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-bold text-muted uppercase">{h}</th>)}</tr></thead>
                      <tbody className="divide-y divide-border">
                        {blacklist.map(entry => (
                          <tr key={entry.id} className="hover:bg-card-hover transition-colors">
                            <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-bold bg-danger/10 text-danger">{entry.type}</span></td>
                            <td className="px-4 py-3 font-mono text-sm text-foreground">{entry.value}</td>
                            <td className="px-4 py-3 text-text-secondary text-xs">{entry.reason || "—"}</td>
                            <td className="px-4 py-3 text-muted text-xs">{new Date(entry.created_date).toLocaleDateString("en-NG")}</td>
                            <td className="px-4 py-3">
                              <button onClick={() => removeFromBlacklist(entry.id)} className="text-danger/70 hover:text-danger transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Resolved alerts */}
            {activeTab === "resolved" && (
              <div className="space-y-3">
                {resolvedAlerts.length === 0 ? (
                  <div className="bg-card rounded-2xl border border-border py-16 text-center">
                    <p className="text-muted">No resolved alerts yet</p>
                  </div>
                ) : resolvedAlerts.map(alert => (
                  <div key={alert.id} className="bg-card rounded-2xl border border-border p-5 opacity-60">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-foreground text-sm">{alert.alert_type}</div>
                        <div className="text-muted text-xs">{alert.email} · {new Date(alert.created_date).toLocaleDateString("en-NG")}</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-success/10 text-success">Resolved</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
