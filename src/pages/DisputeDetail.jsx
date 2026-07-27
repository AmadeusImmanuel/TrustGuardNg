import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, DisputeCenter, disputeActions, FILE_BASE_URL } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import { AlertTriangle, ChevronLeft, Plus, Clock, CheckCircle, FileText, Link, Image, Video as VideoIcon, X } from "lucide-react";

const STATUS_CONFIG = {
  OPEN:         { label: "Open",         className: "bg-danger/10 text-danger" },
  UNDER_REVIEW: { label: "Under Review", className: "bg-warning/10 text-warning" },
  RESOLVED:     { label: "Resolved",     className: "bg-success/10 text-success" },
};

const EVIDENCE_TYPES = [
  { value: "text",  label: "Text Description",  icon: FileText,  isFile: false },
  { value: "url",   label: "Link / URL",         icon: Link,      isFile: false },
  { value: "image", label: "Photos / Screenshots", icon: Image,     isFile: true, accept: "image/*" },
  { value: "video", label: "Videos",             icon: VideoIcon, isFile: true, accept: "video/*" },
];

export default function DisputeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dispute, setDispute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEvidence, setShowEvidence] = useState(false);
  const [showAppeal, setShowAppeal] = useState(false);
  const [evidenceForm, setEvidenceForm] = useState({ type: "text", content: "", label: "", files: [] });
  const [filePreviews, setFilePreviews] = useState([]); // array of { url, name }
  const [appealReason, setAppealReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const u = await auth.me();
        setUser(u);
        const d = await DisputeCenter.getDetail(id);
        setDispute(d);
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    // Revoke all object URLs on unmount to avoid leaking memory.
    return () => { filePreviews.forEach(p => URL.revokeObjectURL(p.url)); };
  }, [filePreviews]);

  const currentType = EVIDENCE_TYPES.find(t => t.value === evidenceForm.type);

  const clearFiles = () => {
    filePreviews.forEach(p => URL.revokeObjectURL(p.url));
    setEvidenceForm(f => ({ ...f, files: [] }));
    setFilePreviews([]);
  };

  const MAX_EVIDENCE_FILES = 10;

  const handleFilesSelect = (fileList) => {
    const newFiles = Array.from(fileList || []);
    if (newFiles.length === 0) return;

    const remainingSlots = MAX_EVIDENCE_FILES - evidenceForm.files.length;
    if (remainingSlots <= 0) {
      alert(`You can attach up to ${MAX_EVIDENCE_FILES} files per submission. Remove some before adding more.`);
      return;
    }

    const accepted = newFiles.slice(0, remainingSlots);
    const rejectedCount = newFiles.length - accepted.length;
    if (rejectedCount > 0) {
      alert(`Only ${remainingSlots} more file${remainingSlots === 1 ? "" : "s"} could be added — the ${MAX_EVIDENCE_FILES}-file limit was reached, so ${rejectedCount} file${rejectedCount === 1 ? " was" : "s were"} skipped.`);
    }

    const combined = [...evidenceForm.files, ...accepted];
    const newPreviews = accepted.map(f => ({ url: URL.createObjectURL(f), name: f.name }));
    setEvidenceForm(f => ({ ...f, files: combined }));
    setFilePreviews(p => [...p, ...newPreviews]);
  };

  const removeFile = (index) => {
    URL.revokeObjectURL(filePreviews[index].url);
    setEvidenceForm(f => ({ ...f, files: f.files.filter((_, i) => i !== index) }));
    setFilePreviews(p => p.filter((_, i) => i !== index));
  };

  const submitEvidence = async (e) => {
    e.preventDefault();
    if (!evidenceForm.label) return;
    if (currentType.isFile ? evidenceForm.files.length === 0 : !evidenceForm.content) return;

    setSubmitting(true);
    try {
      const result = currentType.isFile
        ? await DisputeCenter.addEvidenceFile(id, evidenceForm.files, evidenceForm.label)
        : await DisputeCenter.addEvidence(id, { type: evidenceForm.type, content: evidenceForm.content, label: evidenceForm.label });

      setDispute({ ...dispute, evidence_files: result.evidence_files });
      clearFiles();
      setEvidenceForm({ type: "text", content: "", label: "", files: [] });
      setShowEvidence(false);
    } catch (err) { alert(err.message); }
    setSubmitting(false);
  };

  const submitAppeal = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await DisputeCenter.appeal(id, appealReason);
      setDispute({ ...dispute, status: "UNDER_REVIEW" });
      setShowAppeal(false);
    } catch (err) { alert(err.message); }
    setSubmitting(false);
  };

  const statusConfig = STATUS_CONFIG[dispute?.status] || STATUS_CONFIG.OPEN;

  if (loading) return <AppLayout user={user}><div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" /></div></AppLayout>;

  if (!dispute) return <AppLayout user={user}><div className="max-w-2xl mx-auto px-4 py-20 text-center"><p className="text-muted">Dispute not found.</p></div></AppLayout>;

  const timeline = dispute.timeline || [];
  const evidenceFiles = dispute.evidence_files || [];

  return (
    <AppLayout user={user}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={() => navigate("/disputes")} className="flex items-center gap-1 text-muted hover:text-foreground text-sm mb-6">
          <ChevronLeft className="w-4 h-4" /> Back to Disputes
        </button>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-foreground">Dispute #{id.slice(-8).toUpperCase()}</h1>
            <p className="text-muted text-sm mt-1">{dispute.item_name} · Ref: {dispute.reference}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-bold ${statusConfig.className}`}>
            {statusConfig.label}
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="md:col-span-2 space-y-4">
            {/* Dispute info */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-bold text-foreground mb-4">Dispute Details</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><div className="text-muted text-xs mb-1">Trade Amount</div><div className="font-bold text-foreground">₦{(Number(dispute.amount) || 0).toLocaleString()}</div></div>
                <div><div className="text-muted text-xs mb-1">Raised By</div><div className="font-semibold text-sm text-foreground">{dispute.raised_by_name || "Unknown"}</div></div>
                <div><div className="text-muted text-xs mb-1">Date Raised</div><div className="font-semibold text-sm text-foreground">{new Date(dispute.created_date).toLocaleDateString("en-NG")}</div></div>
                <div><div className="text-muted text-xs mb-1">Trade Reference</div><div className="font-semibold text-sm text-foreground">{dispute.reference}</div></div>
              </div>
              <div>
                <div className="text-muted text-xs mb-2">Reason for Dispute</div>
                <div className="bg-card-hover rounded-xl p-4 text-sm text-text-secondary leading-relaxed">{dispute.reason}</div>
              </div>
              {dispute.evidence?.text && (
                <div className="mt-4">
                  <div className="text-muted text-xs mb-2">Initial Evidence</div>
                  <div className="bg-card-hover rounded-xl p-4 text-sm text-text-secondary">{dispute.evidence.text}</div>
                </div>
              )}
              {dispute.resolution && (
                <div className="mt-4 p-4 rounded-xl border border-success/30 bg-success/10">
                  <div className="text-xs font-semibold text-success mb-1">Admin Resolution</div>
                  <div className="text-sm text-text-secondary">{dispute.resolution}</div>
                </div>
              )}
              {dispute.admin_notes && (
                <div className="mt-4 p-4 rounded-xl border border-info/30 bg-info/10">
                  <div className="text-xs font-semibold text-info mb-1">Admin Notes</div>
                  <div className="text-sm text-text-secondary">{dispute.admin_notes}</div>
                </div>
              )}
            </div>

            {/* Evidence submitted */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-foreground">Evidence ({evidenceFiles.length})</h2>
                {dispute.status !== "RESOLVED" && (
                  <button onClick={() => setShowEvidence(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-primary-foreground text-xs font-semibold bg-primary hover:bg-primary-hover transition-colors">
                    <Plus className="w-3 h-3" /> Add Evidence
                  </button>
                )}
              </div>
              {evidenceFiles.length === 0 ? (
                <div className="text-center py-8 bg-card-hover rounded-xl">
                  <FileText className="w-8 h-8 text-disabled mx-auto mb-2" />
                  <p className="text-muted text-sm">No evidence submitted yet</p>
                  <p className="text-disabled text-xs mt-1">Add photos, videos, links, or text descriptions to support your case</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {evidenceFiles.map((ev, i) => {
                    const typeConfig = EVIDENCE_TYPES.find(t => t.value === ev.type) || EVIDENCE_TYPES[0];
                    const Icon = typeConfig.icon;
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
                              <span className="text-xs px-2 py-0.5 rounded-full bg-card border border-border text-muted">{typeConfig.label}</span>
                            </div>
                            {!isMedia && <p className="text-sm text-text-secondary">{ev.content}</p>}
                            <span className="text-xs text-muted mt-1 block">{new Date(ev.submitted_at).toLocaleDateString("en-NG")}</span>
                          </div>
                        </div>
                        {isMedia && (
                          <div className="mt-3">
                            {ev.type === "image" ? (
                              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                <img src={fileUrl} alt={ev.label} className="max-h-64 rounded-lg border border-border object-contain" />
                              </a>
                            ) : (
                              <video src={fileUrl} controls className="max-h-64 rounded-lg border border-border" />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Appeal section */}
            {dispute.status === "RESOLVED" && !dispute.appeal_reason && (
              <div className="bg-warning/10 border border-warning/30 rounded-2xl p-5">
                <h3 className="font-bold text-warning mb-1">Not satisfied with the ruling?</h3>
                <p className="text-text-secondary text-sm mb-4">You can file an appeal within 7 days of resolution. Provide new evidence or reasons why the ruling should be reconsidered.</p>
                <button onClick={() => setShowAppeal(true)}
                  className="px-5 py-2.5 rounded-full text-primary-foreground text-sm font-semibold bg-warning hover:opacity-90 transition-opacity">
                  File an Appeal
                </button>
              </div>
            )}
            {dispute.appeal_reason && (
              <div className="bg-info/10 border border-info/30 rounded-2xl p-5">
                <h3 className="font-bold text-info mb-1">Appeal Submitted</h3>
                <p className="text-text-secondary text-sm">{dispute.appeal_reason}</p>
                <p className="text-muted text-xs mt-2">Submitted {new Date(dispute.appealed_at).toLocaleDateString("en-NG")}</p>
              </div>
            )}
          </div>

          {/* Timeline sidebar */}
          <div className="space-y-4">
            <div className="bg-card rounded-2xl border border-border p-5">
              <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Timeline
              </h2>
              {timeline.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted text-sm">No events yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-danger/10">
                        <AlertTriangle className="w-3 h-3 text-danger" />
                      </div>
                      <div className="w-0.5 flex-1 bg-border mt-1" />
                    </div>
                    <div className="pb-4">
                      <div className="text-sm font-semibold text-foreground">Dispute Raised</div>
                      <div className="text-xs text-muted mt-0.5">{new Date(dispute.created_date).toLocaleDateString("en-NG")}</div>
                    </div>
                  </div>
                  {timeline.map((event, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-card-hover">
                          <CheckCircle className="w-3 h-3 text-muted" />
                        </div>
                        {i < timeline.length - 1 && <div className="w-0.5 flex-1 bg-border mt-1" />}
                      </div>
                      <div className="pb-4">
                        <div className="text-sm font-semibold text-foreground">{event.event}</div>
                        <div className="text-xs text-muted mt-0.5">{event.actor}</div>
                        <div className="text-xs text-disabled mt-0.5">{new Date(event.timestamp).toLocaleDateString("en-NG")}</div>
                      </div>
                    </div>
                  ))}
                  {dispute.status === "RESOLVED" && (
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-success/10">
                        <CheckCircle className="w-3 h-3 text-success" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">Dispute Resolved</div>
                        <div className="text-xs text-muted mt-0.5">{dispute.resolution}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-card-hover rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-foreground text-sm">What happens next?</h3>
              {dispute.status === "OPEN" && <p className="text-muted text-xs leading-relaxed">Our team will review your dispute within 24-48 hours. Add any evidence that supports your case.</p>}
              {dispute.status === "UNDER_REVIEW" && <p className="text-muted text-xs leading-relaxed">Our compliance team is actively reviewing your case. A ruling will be made within 24 hours.</p>}
              {dispute.status === "RESOLVED" && <p className="text-muted text-xs leading-relaxed">This dispute has been resolved. If you disagree with the ruling, you can file an appeal within 7 days.</p>}
            </div>
          </div>
        </div>

        {/* Add Evidence Modal */}
        {showEvidence && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-card rounded-2xl p-6 w-full max-w-md border border-border max-h-[90vh] overflow-y-auto">
              <h2 className="font-bold text-foreground text-lg mb-4">Add Evidence</h2>
              <form onSubmit={submitEvidence} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-1.5">Evidence Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {EVIDENCE_TYPES.map(({ value, label, icon: Icon }) => (
                      <button key={value} type="button"
                        onClick={() => { setEvidenceForm(f => ({ ...f, type: value, content: "" })); clearFiles(); }}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${evidenceForm.type === value ? "text-primary-foreground bg-primary border-primary" : "border-border text-text-secondary"}`}>
                        <Icon className="w-4 h-4" /> {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-1.5">Evidence Label *</label>
                  <input required value={evidenceForm.label} onChange={e => setEvidenceForm({ ...evidenceForm, label: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                    placeholder="e.g. WhatsApp conversation screenshots" />
                </div>

                {currentType.isFile ? (
                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-1.5">
                      {currentType.value === "image" ? "Upload Photos *" : "Upload Videos *"}
                    </label>
                    <label className="flex flex-col items-center justify-center gap-2 w-full px-4 py-6 rounded-xl border-2 border-dashed border-border bg-background hover:border-primary/50 cursor-pointer transition-colors">
                      <currentType.icon className="w-6 h-6 text-muted" />
                      <span className="text-sm text-text-secondary text-center">
                        {evidenceForm.files.length > 0
                          ? `${evidenceForm.files.length}/${MAX_EVIDENCE_FILES} files selected — click to add more`
                          : `Click to choose ${currentType.value === "image" ? "photos" : "videos"} (max 25MB each, up to ${MAX_EVIDENCE_FILES} files)`}
                      </span>
                      <input type="file" accept={currentType.accept} multiple={true} className="hidden"
                        onChange={e => { handleFilesSelect(e.target.files); e.target.value = ""; }} />
                    </label>

                    {filePreviews.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {filePreviews.map((p, i) => (
                          <div key={i} className="relative group">
                            {currentType.value === "image" ? (
                              <img src={p.url} alt={p.name} className="w-full h-20 object-cover rounded-lg border border-border" />
                            ) : (
                              <video src={p.url} className="w-full h-20 object-cover rounded-lg border border-border" />
                            )}
                            <button type="button" onClick={() => removeFile(i)}
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-danger text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-1.5">
                      {evidenceForm.type === "url" ? "URL / Link *" : "Description / Content *"}
                    </label>
                    <textarea required rows={4} value={evidenceForm.content}
                      onChange={e => setEvidenceForm({ ...evidenceForm, content: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary resize-none"
                      placeholder={evidenceForm.type === "url" ? "https://..." : "Describe what this evidence shows..."} />
                  </div>
                )}

                <div className="flex gap-3">
                  <button type="button" onClick={() => { setShowEvidence(false); clearFiles(); setEvidenceForm({ type: "text", content: "", label: "", files: [] }); }} className="flex-1 py-3 rounded-full border border-border text-sm font-semibold text-text-secondary">Cancel</button>
                  <button type="submit" disabled={submitting} className="flex-1 py-3 rounded-full text-primary-foreground text-sm font-semibold disabled:opacity-60 bg-primary hover:bg-primary-hover transition-colors">
                    {submitting ? "Submitting..." : "Submit Evidence"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Appeal Modal */}
        {showAppeal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-card rounded-2xl p-6 w-full max-w-md border border-border">
              <h2 className="font-bold text-foreground text-lg mb-2">File an Appeal</h2>
              <p className="text-muted text-sm mb-4">Explain why you believe the ruling was incorrect and provide any new evidence.</p>
              <form onSubmit={submitAppeal} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-1.5">Appeal Reason *</label>
                  <textarea required rows={5} value={appealReason} onChange={e => setAppealReason(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none resize-none"
                    placeholder="Explain why the ruling was incorrect and provide new supporting evidence..." />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowAppeal(false)} className="flex-1 py-3 rounded-full border border-border text-sm font-semibold text-text-secondary">Cancel</button>
                  <button type="submit" disabled={submitting} className="flex-1 py-3 rounded-full text-primary-foreground text-sm font-semibold disabled:opacity-60 bg-warning hover:opacity-90 transition-opacity">
                    {submitting ? "Submitting..." : "Submit Appeal"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
