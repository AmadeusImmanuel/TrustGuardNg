import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { ShieldCheck, ShieldAlert, ShieldX, Clock } from "lucide-react";

const statusConfig = {
  Unverified: { icon: ShieldAlert, color: "text-amber-500", bg: "bg-amber-50 border-amber-200", label: "Not Verified" },
  Pending: { icon: Clock, color: "text-blue-500", bg: "bg-blue-50 border-blue-200", label: "Verification Pending" },
  Verified: { icon: ShieldCheck, color: "text-green-500", bg: "bg-green-50 border-green-200", label: "Identity Verified" },
  Failed: { icon: ShieldX, color: "text-red-500", bg: "bg-red-50 border-red-200", label: "Verification Failed" },
};

export default function KYCSection({ user, onUpdate }) {
  const [form, setForm] = useState({ method: "NIN", value: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const status = user?.kyc_status || "Unverified";
  const cfg = statusConfig[status];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate Smile ID verification (in production, this would call Smile ID API via backend function)
    await base44.auth.updateMe({
      kyc_status: "Pending",
      kyc_method: form.method,
      kyc_submitted_value: form.value.slice(0, 4) + "****" + form.value.slice(-2),
    });
    // Simulate verification result after 2s
    setTimeout(async () => {
      await base44.auth.updateMe({
        kyc_status: "Verified",
        kyc_verified_at: new Date().toISOString(),
      });
      await onUpdate();
      setSubmitted(false);
      setLoading(false);
    }, 2000);
    setSubmitted(true);
    await onUpdate();
  };

  return (
    <div className={`rounded-2xl border p-5 ${cfg.bg}`}>
      <div className="flex items-center gap-3 mb-3">
        <cfg.icon className={`w-6 h-6 ${cfg.color}`} />
        <div>
          <div className="font-bold text-[#0D1F3C] text-sm">Identity Verification (KYC)</div>
          <div className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</div>
        </div>
      </div>

      {status === "Verified" && (
        <p className="text-green-700 text-xs">
          Your identity is verified via {user?.kyc_method}. You can withdraw funds to your bank account.
        </p>
      )}

      {status === "Pending" && (
        <p className="text-blue-700 text-xs">Your verification is being processed. This usually takes a few seconds.</p>
      )}

      {status === "Failed" && (
        <p className="text-red-700 text-xs mb-3">Verification failed. Please try again with correct details or contact support.</p>
      )}

      {(status === "Unverified" || status === "Failed") && (
        <form onSubmit={handleSubmit} className="mt-3 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Verification Method</label>
            <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-white">
              {["NIN", "BVN"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setForm({ ...form, method: m })}
                  className={`flex-1 py-2 text-sm font-semibold transition-all ${form.method === m ? "text-white" : "text-gray-500"}`}
                  style={form.method === m ? { background: "#0D1F3C" } : {}}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Enter your {form.method} *</label>
            <input
              required
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500 bg-white"
              placeholder={form.method === "NIN" ? "11-digit NIN" : "11-digit BVN"}
              maxLength={11}
              minLength={11}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-full text-white font-semibold text-sm disabled:opacity-60"
            style={{ background: "#0D1F3C" }}
          >
            {loading ? "Verifying..." : `Verify with ${form.method} →`}
          </button>
          <p className="text-xs text-gray-400 text-center">
            Powered by Smile ID · Your data is encrypted and secure
          </p>
        </form>
      )}
    </div>
  );
}