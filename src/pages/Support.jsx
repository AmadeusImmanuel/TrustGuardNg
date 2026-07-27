import React, { useEffect, useState } from "react";
import { auth, SupportAPI } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import { MessageSquare, CheckCircle, Clock } from "lucide-react";

export default function Support() {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ subject: "", message: "", priority: "normal" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const u = await auth.me();
        setUser(u);
        const t = await SupportAPI.list();
        setTickets(t);
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const ticket = await SupportAPI.create(form);
      setTickets([ticket, ...tickets]);
      setForm({ subject: "", message: "", priority: "normal" });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) { alert(err.message); }
    setSubmitting(false);
  };

  const STATUS_STYLES = {
    open:     { className: "bg-danger/10 text-danger", label: "Open" },
    answered: { className: "bg-success/10 text-success", label: "Answered" },
    closed:   { className: "bg-card-hover text-muted", label: "Closed" },
  };

  const PRIORITY_STYLES = {
    low: "bg-primary",
    normal: "bg-info",
    high: "bg-danger",
  };

  return (
    <AppLayout user={user}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-foreground mb-2">Support Center</h1>
        <p className="text-muted text-sm mb-8">Submit a ticket and our team will respond within 24 hours.</p>

        {/* Submit ticket */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-8">
          <h2 className="font-bold text-foreground mb-4">New Support Ticket</h2>
          {submitted && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-success/10 text-success text-sm mb-4">
              <CheckCircle className="w-4 h-4" /> Ticket submitted! We'll respond within 24 hours.
            </div>
          )}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1.5">Subject *</label>
              <input required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                placeholder="Brief description of your issue" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1.5">Priority</label>
              <div className="flex gap-3">
                {["low", "normal", "high"].map(p => (
                  <button key={p} type="button" onClick={() => setForm({ ...form, priority: p })}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${form.priority === p ? `text-white border-transparent ${PRIORITY_STYLES[p]}` : "border-border text-muted"}`}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1.5">Message *</label>
              <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary resize-none"
                placeholder="Describe your issue in detail..." />
            </div>
            <button type="submit" disabled={submitting}
              className="w-full py-3 rounded-full text-primary-foreground font-bold text-sm disabled:opacity-60 bg-primary hover:bg-primary-hover transition-colors">
              {submitting ? "Submitting..." : "Submit Ticket"}
            </button>
          </form>
        </div>

        {/* My tickets */}
        <h2 className="font-bold text-foreground mb-4">My Tickets ({tickets.length})</h2>
        {loading ? (
          <div className="flex justify-center py-8"><div className="w-6 h-6 border-4 border-border border-t-primary rounded-full animate-spin" /></div>
        ) : tickets.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border py-12 text-center">
            <MessageSquare className="w-10 h-10 text-disabled mx-auto mb-3" />
            <p className="text-muted text-sm">No tickets yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map(ticket => {
              const sc = STATUS_STYLES[ticket.status] || STATUS_STYLES.open;
              return (
                <div key={ticket.id} className="bg-card rounded-2xl border border-border p-5">
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-semibold text-foreground text-sm">{ticket.subject}</span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${sc.className}`}>{sc.label}</span>
                  </div>
                  <p className="text-muted text-xs mb-2">{new Date(ticket.created_date).toLocaleDateString("en-NG")}</p>
                  {ticket.admin_response && (
                    <div className="bg-success/10 border border-success/20 rounded-xl p-3 mt-3">
                      <div className="text-xs text-success font-semibold mb-1">Support Response</div>
                      <p className="text-sm text-text-secondary">{ticket.admin_response}</p>
                    </div>
                  )}
                  {!ticket.admin_response && (
                    <div className="flex items-center gap-1 text-warning text-xs mt-2">
                      <Clock className="w-3 h-3" /> Awaiting response
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
