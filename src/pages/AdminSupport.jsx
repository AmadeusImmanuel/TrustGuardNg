import React, { useEffect, useState } from "react";
import { auth, AdminAPI } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react";

const PRIORITY_STYLES = {
  low:    "bg-success/10 text-success",
  normal: "bg-info/10 text-info",
  high:   "bg-danger/10 text-danger",
};

const STATUS_STYLES = {
  open:     "bg-danger/10 text-danger",
  answered: "bg-success/10 text-success",
  closed:   "bg-card-hover text-muted",
};

export default function AdminSupport() {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [response, setResponse] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const u = await auth.me();
        setUser(u);
        const t = await AdminAPI.tickets();
        setTickets(t);
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, []);

  const respond = async (ticketId) => {
    if (!response.trim()) return;
    setSubmitting(true);
    try {
      const updated = await AdminAPI.respondTicket(ticketId, response, "answered");
      setTickets(tickets.map(t => t.id === ticketId ? updated : t));
      setResponse("");
      setExpanded(null);
    } catch (err) { alert(err.message); }
    setSubmitting(false);
  };

  return (
    <AppLayout user={user}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-foreground mb-6">Support Tickets</h1>
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" /></div>
        ) : tickets.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border py-20 text-center">
            <MessageSquare className="w-12 h-12 text-disabled mx-auto mb-4" />
            <p className="text-text-secondary">No support tickets yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map(ticket => {
              const pc = PRIORITY_STYLES[ticket.priority] || PRIORITY_STYLES.normal;
              const sc = STATUS_STYLES[ticket.status] || STATUS_STYLES.open;
              const isOpen = expanded === ticket.id;
              return (
                <div key={ticket.id} className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                  <button onClick={() => setExpanded(isOpen ? null : ticket.id)}
                    className="w-full flex items-center gap-4 px-6 py-4 hover:bg-card-hover text-left transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-foreground text-sm">{ticket.subject}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${pc}`}>{ticket.priority}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${sc}`}>{ticket.status}</span>
                      </div>
                      <div className="text-muted text-xs">{ticket.user_email} · {new Date(ticket.created_date).toLocaleDateString("en-NG")}</div>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-muted shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 border-t border-border">
                      <div className="bg-card-hover rounded-xl p-4 mb-4 mt-4">
                        <div className="text-xs text-muted mb-1">User Message</div>
                        <p className="text-sm text-text-secondary leading-relaxed">{ticket.message}</p>
                      </div>
                      {ticket.admin_response ? (
                        <div className="bg-success/10 border border-success/20 rounded-xl p-4 mb-4">
                          <div className="text-xs text-success font-semibold mb-1">Your Response</div>
                          <p className="text-sm text-text-secondary">{ticket.admin_response}</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <textarea value={response} onChange={e => setResponse(e.target.value)}
                            rows={4} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none resize-none"
                            placeholder="Type your response to the user..." />
                          <div className="flex gap-3">
                            <button onClick={() => setExpanded(null)} className="flex-1 py-2.5 rounded-full border border-border text-sm font-semibold text-text-secondary">Cancel</button>
                            <button onClick={() => respond(ticket.id)} disabled={submitting || !response.trim()}
                              className="flex-1 py-2.5 rounded-full text-primary-foreground text-sm font-semibold disabled:opacity-60 bg-primary hover:bg-primary-hover transition-colors">
                              {submitting ? "Sending..." : "Send Response"}
                            </button>
                          </div>
                        </div>
                      )}
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
