import React, { useEffect, useState } from "react";
import { auth, platformSettings } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import { Percent } from "lucide-react";

export default function AdminSettings() {
  const [user, setUser] = useState(null);
  const [feeRate, setFeeRate] = useState(1.5);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const u = await auth.me();
        setUser(u);
        const r = await platformSettings.getFeeRate();
        setFeeRate(r.fee_rate * 100);
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await platformSettings.setFeeRate(feeRate / 100);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || "Failed to update fee rate");
    }
    setSaving(false);
  };

  return (
    <AppLayout user={user}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-[#0D1F3C] mb-6">Platform Settings</h1>
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" /></div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#f0fff7" }}>
                <Percent className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="font-bold text-[#0D1F3C]">Escrow Fee Rate</h2>
                <p className="text-gray-500 text-sm">Applies to all new trades platform-wide.</p>
              </div>
            </div>
            {error && <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>}
            {saved && <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 text-green-700 text-sm">Fee rate updated successfully.</div>}
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Fee Percentage (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  required
                  value={feeRate}
                  onChange={(e) => setFeeRate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500"
                  placeholder="1.5"
                />
                <p className="text-gray-400 text-xs mt-1.5">Current rate: {feeRate}% on every new trade. Existing trades keep the rate they were created with.</p>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-full text-white font-bold text-sm disabled:opacity-60"
                style={{ background: "#00A651" }}
              >
                {saving ? "Saving..." : "Save Fee Rate"}
              </button>
            </form>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
