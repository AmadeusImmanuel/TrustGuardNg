import React, { useEffect, useState } from "react";
import { auth, Dispute, disputeActions, DisputeCenter, FILE_BASE_URL } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import { AlertTriangle, Clock, CheckCircle, FileText, Link as LinkIcon, Image, Video as VideoIcon, User as UserIcon, MessageCircle, Send } from "lucide-react";

const EVIDENCE_ICONS = {
  text: FileText,
  url: LinkIcon,
  image: Image,
  video: VideoIcon,
  chat: FileText,
};

export default function AdminDisputes() {
  const [user, setUser] = useState(null);
  const [disputes, setDisputes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [ruling, setRuling] = useState("");
  const [adminMessage, setAdminMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const u = await auth.me();
        setUser(u);
        const all = await Dispute.list();
        setDisputes(all);
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, []);

  const fetchDetail = async (disputeId) => {
    setDetailLoading(true);
    try {
      const full = await DisputeCenter.getDetail(disputeId);
      setDetail(full);
    } catch (e) { console.error(e); }
    setDetailLoading(false);
  };

  const selectDispute = async (d) => {
    setSelected(d);
    setDetail(null);
    setNote("");
    setRuling("");
    setAdminMessage("");
    setMessageSent(false);
    await fetchDetail(d.id);
  };

  const updateStatus = async (d, status) => {
    await Dispute.update(d.id, { status });
    setDisputes(disputes.map((x) => x.id === d.id ? { ...x, status } : x));
    if (detail && detail.id === d.id) setDetail({ ...detail, status });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!adminMessage.trim() || !selected) return;
    setSendingMessage(true);
    try {
      await DisputeCenter.sendAdminMessage(selected.id, adminMessage.trim());
      setAdminMessage("");
      setMessageSent(true);
      setTimeout(() => setMessageSent(false), 3000);
      await fetchDetail(selected.id); // refresh timeline to show the new message
    } catch (err) { alert(err.message); }
    setSendingMessage(false);
  };

  const resolve = async () => {
    if (!selected || !ruling) return;
    try {
      await disputeActions.resolve(selected.id, ruling, note);
      const all = await Dispute.list();
      setDisputes(all);
      setSelected(null);
      setDetail(null);
      setNote("");
      setRuling("");
    } catch (e) { alert(e.message); }
  };

  const statusText = { OPEN: "text-danger", UNDER_REVIEW: "text-warning", RESOLVED: "text-success" };
  const fmt = (v) => "₦" + (Number(v) || 0).toLocaleString("en-NG");

  return (
    <AppLayout user={user}>
      <div className="max-w-6xl mx-auto px-4 py-8 flex gap-6">
        <div className="w-80 shrink-0">
          <h1 className="text-xl font-black text-foreground mb-4">Disputes</h1>
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-4 border-border border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              {disputes.map((d) => (
                <button key={d.id} onClick={() => selectDispute(d)}
                  className={`w-full text-left px-4 py-3 border-b border-border hover:bg-card-hover transition-colors ${selected?.id === d.id ? "bg-primary/10" : ""}`}>
                  <div className="text-sm font-semibold text-foreground truncate">{d.reason?.substring(0, 40) || "Dispute"}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-bold ${statusText[d.status] || "text-danger"}`}>{d.status}</span>
                    <span className="text-xs text-muted">{new Date(d.created_date).toLocaleDateString("en-NG")}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4">
          {!selected ? (
            <div className="bg-card rounded-2xl border border-border flex items-center justify-center h-64">
              <p className="text-muted">Select a dispute to review</p>
            </div>
          ) : detailLoading ? (
            <div className="bg-card rounded-2xl border border-border flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Trade context */}
              {detail && (
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="font-bold text-foreground mb-4">Trade Context</h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><div className="text-muted text-xs mb-1">Item</div><div className="font-semibold text-foreground">{detail.item_name || "—"}</div></div>
                    <div><div className="text-muted text-xs mb-1">Trade Reference</div><div className="font-semibold text-foreground">{detail.reference || "—"}</div></div>
                    <div><div className="text-muted text-xs mb-1">Buyer</div><div className="font-semibold text-foreground">{detail.buyer_email || "—"}</div></div>
                    <div><div className="text-muted text-xs mb-1">Seller</div><div className="font-semibold text-foreground">{detail.seller_email || "—"}</div></div>
                    <div className="flex items-center gap-1.5">
                      <UserIcon className="w-3.5 h-3.5 text-muted" />
                      <span className="text-muted text-xs">Raised by</span>
                      <span className="font-semibold text-foreground text-xs">{detail.raised_by_name || "Unknown"}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Main dispute panel */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-foreground">Dispute Details</h2>
                  <select value={selected.status} onChange={(e) => updateStatus(selected, e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-border text-sm bg-background text-foreground focus:outline-none">
                    <option value="OPEN">Open</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                </div>
                <div className="space-y-3 mb-6">
                  <div><div className="text-xs text-muted mb-1">Reason</div><div className="text-sm text-text-secondary">{selected.reason}</div></div>
                  <div><div className="text-xs text-muted mb-1">Amount</div><div className="font-bold text-foreground">{fmt(selected.amount)}</div></div>
                  {selected.evidence?.text && <div><div className="text-xs text-muted mb-1">Initial Evidence Note</div><div className="text-sm text-text-secondary">{selected.evidence.text}</div></div>}
                </div>

                {/* Evidence files */}
                <div className="border-t border-border pt-5">
                  <h3 className="font-bold text-foreground mb-3">Evidence Submitted ({(detail?.evidence_files || []).length})</h3>
                  {(!detail?.evidence_files || detail.evidence_files.length === 0) ? (
                    <p className="text-muted text-sm">No evidence files submitted yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {detail.evidence_files.map((ev, i) => {
                        const Icon = EVIDENCE_ICONS[ev.type] || FileText;
                        const isMedia = ev.type === "image" || ev.type === "video";
                        const fileUrl = isMedia ? `${FILE_BASE_URL}${ev.content}` : null;
                        return (
                          <div key={i} className="p-4 rounded-xl bg-card-hover border border-border">
                            <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-primary/10">
                                <Icon className="w-4 h-4 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-sm text-foreground">{ev.label}</span>
                                  <span className="text-xs text-muted">submitted by {ev.submitted_by === detail.buyer_id ? "buyer" : ev.submitted_by === detail.seller_id ? "seller" : "user"}</span>
                                </div>
                                {!isMedia && ev.type === "url" ? (
                                  <a href={ev.content} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline break-all">{ev.content}</a>
                                ) : !isMedia ? (
                                  <p className="text-sm text-text-secondary">{ev.content}</p>
                                ) : null}
                                <span className="text-xs text-muted mt-1 block">{new Date(ev.submitted_at).toLocaleDateString("en-NG")}</span>
                              </div>
                            </div>
                            {isMedia && (
                              <div className="mt-3">
                                {ev.type === "image" ? (
                                  <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                    <img src={fileUrl} alt={ev.label} className="max-h-72 rounded-lg border border-border object-contain" />
                                  </a>
                                ) : (
                                  <video src={fileUrl} controls className="max-h-72 rounded-lg border border-border" />
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Appeal, if any */}
                {detail?.appeal_reason && (
                  <div className="mt-5 p-4 rounded-xl border border-info/30 bg-info/10">
                    <div className="text-xs font-semibold text-info mb-1">Appeal Filed</div>
                    <p className="text-sm text-text-secondary">{detail.appeal_reason}</p>
                    {detail.appealed_at && <p className="text-xs text-muted mt-1">{new Date(detail.appealed_at).toLocaleDateString("en-NG")}</p>}
                  </div>
                )}

                {/* Message buyer & seller */}
                <div className="border-t border-border pt-6 mt-6">
                  <h3 className="font-bold text-foreground mb-1 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-info" /> Message Buyer & Seller
                  </h3>
                  <p className="text-muted text-xs mb-3">Sends a notification to both parties and adds it to the shared timeline below.</p>
                  <form onSubmit={sendMessage} className="flex gap-2">
                    <input value={adminMessage} onChange={(e) => setAdminMessage(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-info"
                      placeholder="e.g. Please clarify what condition the item arrived in..." />
                    <button type="submit" disabled={sendingMessage || !adminMessage.trim()}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-50 bg-info hover:opacity-90 transition-opacity shrink-0">
                      <Send className="w-3.5 h-3.5" /> {sendingMessage ? "Sending..." : "Send"}
                    </button>
                  </form>
                  {messageSent && <p className="text-success text-xs mt-2">✓ Message sent to buyer and seller</p>}
                </div>

                {/* Ruling controls */}
                <div className="border-t border-border pt-6 mt-6">
                  <h3 className="font-bold text-foreground mb-3">Admin Ruling</h3>
                  <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none resize-none mb-3"
                    placeholder="Admin notes and resolution..." />
                  <div className="flex gap-3">
                    {["refund", "release", "split"].map((r) => (
                      <button key={r} onClick={() => setRuling(r)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${ruling === r ? "text-primary-foreground border-transparent bg-primary" : "border-border text-text-secondary"}`}>
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </button>
                    ))}
                  </div>
                  <button onClick={resolve} disabled={!ruling}
                    className="mt-3 w-full py-3 rounded-full text-primary-foreground font-bold text-sm disabled:opacity-40 bg-primary hover:bg-primary-hover transition-colors">
                    Apply Ruling
                  </button>
                </div>
              </div>

              {/* Timeline */}
              {detail && (detail.timeline || []).length > 0 && (
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" /> Timeline
                  </h2>
                  <div className="space-y-3">
                    {detail.timeline.map((event, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <CheckCircle className="w-4 h-4 text-muted shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-semibold text-foreground">{event.event}</div>
                          <div className="text-xs text-muted">{event.actor} · {new Date(event.timestamp).toLocaleDateString("en-NG")}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
