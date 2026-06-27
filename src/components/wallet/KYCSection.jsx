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
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex items-center gap-4">
        <ShieldCheck className="w-8 h-8 text-green-600 shrink-0" />
        <div><div className="font-bold text-green-800">KYC Verified</div><div className="text-green-600 text-sm mt-0.5">Your identity has been verified.</div></div>
      </div>
    );
  }
  if (done || user?.kyc_status === "pending") {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <div className="font-bold text-amber-800">KYC Under Review</div>
        <div className="text-amber-600 text-sm mt-1">Your documents are being reviewed. This usually takes 24 hours.</div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h2 className="font-bold text-[#0D1F3C] mb-1">Identity Verification (KYC)</h2>
      <p className="text-gray-500 text-sm mb-4">Required to withdraw funds above ₦50,000.</p>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">BVN</label>
          <input required value={form.bvn} onChange={(e) => setForm({ ...form, bvn: e.target.value })} maxLength={11} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500" placeholder="12345678901" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">NIN</label>
          <input required value={form.nin} onChange={(e) => setForm({ ...form, nin: e.target.value })} maxLength={11} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500" placeholder="12345678901" />
        </div>
        <button type="submit" disabled={loading} className="w-full py-3 rounded-full text-white font-bold text-sm disabled:opacity-60" style={{ background: "#00A651" }}>
          {loading ? "Submitting..." : "Submit for Verification"}
        </button>
      </form>
    </div>
  );
}
