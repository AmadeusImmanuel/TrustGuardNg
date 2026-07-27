import React, { useState } from "react";
import { User } from "@/api/base44Client";
import { ShieldCheck } from "lucide-react";

export default function KYCSection({ user, onUpdate }) {
  const [form, setForm] = useState({ bvn: "", nin: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await User.update(user.id, { kyc_status: "pending", kyc_bvn: form.bvn, kyc_nin: form.nin });
      onUpdate && onUpdate(updated);
      setDone(true);
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  if (user?.kyc_status === "verified") {
    return (
      <div className="bg-success/10 border border-success/30 rounded-2xl p-6 flex items-center gap-4">
        <ShieldCheck className="w-8 h-8 text-success shrink-0" />
        <div><div className="font-bold text-success">KYC Verified</div><div className="text-success/80 text-sm mt-0.5">Your identity has been verified.</div></div>
      </div>
    );
  }
  if (done || user?.kyc_status === "pending") {
    return (
      <div className="bg-warning/10 border border-warning/30 rounded-2xl p-6">
        <div className="font-bold text-warning">KYC Under Review</div>
        <div className="text-warning/80 text-sm mt-1">Your documents are being reviewed. This usually takes 24 hours.</div>
      </div>
    );
  }
  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <h2 className="font-bold text-foreground mb-1">Identity Verification (KYC)</h2>
      <p className="text-muted text-sm mb-4">Required to withdraw funds above ₦50,000.</p>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-text-secondary mb-1.5">BVN</label>
          <input required value={form.bvn} onChange={(e) => setForm({ ...form, bvn: e.target.value })} maxLength={11}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary" placeholder="12345678901" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-secondary mb-1.5">NIN</label>
          <input required value={form.nin} onChange={(e) => setForm({ ...form, nin: e.target.value })} maxLength={11}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary" placeholder="12345678901" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-full text-primary-foreground font-bold text-sm disabled:opacity-60 bg-primary hover:bg-primary-hover transition-colors">
          {loading ? "Submitting..." : "Submit for Verification"}
        </button>
      </form>
    </div>
  );
}
