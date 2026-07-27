import React, { useEffect, useState } from "react";
import { auth, AdminAPI } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import { Shield, CheckCircle, XCircle, Clock } from "lucide-react";

export default function AdminKYC() {
  const [user, setUser] = useState(null);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showReject, setShowReject] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const u = await auth.me();
        setUser(u);
        const q = await AdminAPI.kycQueue();
        setQueue(q);
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, []);

  const approve = async (userId) => {
    setProcessing(userId);
    try {
      await AdminAPI.approveKyc(userId);
      setQueue(queue.filter(u => u.id !== userId));
    } catch (err) { alert(err.message); }
    setProcessing(null);
  };

  const reject = async (userId) => {
    setProcessing(userId);
    try {
      await AdminAPI.rejectKyc(userId, rejectReason);
      setQueue(queue.filter(u => u.id !== userId));
      setShowReject(null);
      setRejectReason("");
    } catch (err) { alert(err.message); }
    setProcessing(null);
  };

  return (
    <AppLayout user={user}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground">KYC Approval Queue</h1>
            <p className="text-muted text-sm">{queue.length} pending verification{queue.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" /></div>
        ) : queue.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border py-20 text-center">
            <CheckCircle className="w-12 h-12 text-disabled mx-auto mb-4" />
            <p className="text-text-secondary font-medium">No pending KYC submissions</p>
            <p className="text-muted text-sm mt-1">All identity verifications are up to date.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {queue.map((u) => (
              <div key={u.id} className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-primary-foreground font-black bg-btn-gradient">
                      {(u.full_name || u.email)[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-foreground">{u.full_name || "No name"}</div>
                      <div className="text-muted text-sm">{u.email}</div>
                      <div className="flex items-center gap-1 mt-1 text-warning text-xs font-semibold">
                        <Clock className="w-3 h-3" /> Pending since {new Date(u.created_date).toLocaleDateString("en-NG")}
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-warning/10 text-warning">Pending Review</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-card-hover rounded-xl">
                  <div>
                    <div className="text-muted text-xs mb-1">BVN</div>
                    <div className="font-mono font-semibold text-foreground">{u.kyc_bvn || "Not provided"}</div>
                  </div>
                  <div>
                    <div className="text-muted text-xs mb-1">NIN</div>
                    <div className="font-mono font-semibold text-foreground">{u.kyc_nin || "Not provided"}</div>
                  </div>
                </div>

                {showReject === u.id ? (
                  <div className="space-y-3">
                    <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-danger/30 bg-background text-foreground text-sm focus:outline-none resize-none"
                      rows={3} placeholder="Reason for rejection (will be sent to user)..." />
                    <div className="flex gap-3">
                      <button onClick={() => setShowReject(null)} className="flex-1 py-2.5 rounded-full border border-border text-sm font-semibold text-text-secondary">Cancel</button>
                      <button onClick={() => reject(u.id)} disabled={processing === u.id}
                        className="flex-1 py-2.5 rounded-full text-white text-sm font-semibold bg-danger disabled:opacity-60 hover:opacity-90 transition-opacity">
                        {processing === u.id ? "Rejecting..." : "Confirm Rejection"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <button onClick={() => setShowReject(u.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full border border-danger/30 text-danger text-sm font-semibold hover:bg-danger/10 transition-colors">
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                    <button onClick={() => approve(u.id)} disabled={processing === u.id}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-primary-foreground text-sm font-semibold disabled:opacity-60 bg-primary hover:bg-primary-hover transition-colors">
                      <CheckCircle className="w-4 h-4" />
                      {processing === u.id ? "Approving..." : "Approve KYC"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
