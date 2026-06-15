import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import { AlertTriangle, ChevronDown } from "lucide-react";

const statusColors = {
  OPEN: "bg-red-50 text-red-600",
  UNDER_REVIEW: "bg-amber-50 text-amber-600",
  RESOLVED: "bg-green-50 text-green-600",
};

export default function AdminDisputes() {
  const [user, setUser] = useState(null);
  const [disputes, setDisputes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resolveForm, setResolveForm] = useState({ admin_notes: "", ruling_choice: "RELEASE_TO_SELLER", ruling_split_percentage: 50 });
  const [resolveLoading, setResolveLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const u = await base44.auth.me();
      if (u?.role !== "admin") { window.location.href = "/dashboard"; return; }
      setUser(u);
      const all = await base44.entities.Dispute.list("-created_date", 100);
      setDisputes(all);
      setLoading(false);
    })();
  }, []);

  const updateStatus = async (d, status) => {
    await base44.entities.Dispute.update(d.id, { status });
    setDisputes((prev) => prev.map((x) => x.id === d.id ? { ...x, status } : x));
    if (selected?.id === d.id) setSelected({ ...selected, status });
  };

  const resolve = async (e) => {
    e.preventDefault();
    setResolveLoading(true);
    await base44.entities.Dispute.update(selected.id, {
      status: "RESOLVED",
      admin_notes: resolveForm.admin_notes,
      ruling_choice: resolveForm.ruling_choice,
      ruling_split_percentage: resolveForm.ruling_choice === "PARTIAL_SPLIT" ? resolveForm.ruling_split_percentage : null,
    });
    await base44.entities.Trade.update(selected.trade_id, { status: "Resolved" });
    setDisputes((prev) => prev.map((x) => x.id === selected.id ? { ...x, status: "RESOLVED", ...resolveForm } : x));
    setSelected(null);
    setResolveLoading(false);
  };

  return (
    <AppLayout user={user}>
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        <h1 className="text-2xl font-black text-[#0D1F3C] mb-6">Dispute Center</h1>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" /></div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-50 text-sm font-bold text-[#0D1F3C]">All Disputes ({disputes.length})</div>
              <div className="divide-y divide-gray-50 max-h-[calc(100vh-200px)] overflow-y-auto">
                {disputes.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 text-sm">No disputes</div>
                ) : disputes.map((d) => (
                  <button key={d.id} onClick={() => setSelected(d)}
                    className={`w-full text-left px-4 py-4 hover:bg-gray-50 transition-colors ${selected?.id === d.id ? "bg-blue-50" : ""}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-[#0D1F3C] truncate flex-1">{d.trade_reference}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ml-2 shrink-0 ${statusColors[d.status]}`}>{d.status?.replace("_", " ")}</span>
                    </div>
                    <div className="text-gray-500 text-xs truncate">{d.description}</div>
                    <div className="text-gray-400 text-xs mt-1">by {d.raised_by_name} ({d.raised_by_role})</div>
                  </button>
                ))}
              </div>
            </div>

            {selected ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-[#0D1F3C]">Dispute Details</h2>
                  <button onClick={() => setSelected(null)} className="text-gray-400 text-sm">Close</button>
                </div>
                <div className="space-y-3 mb-6">
                  <div><div className="text-xs text-gray-400 mb-0.5">Trade Reference</div><div className="font-semibold text-sm text-[#0D1F3C]">{selected.trade_reference}</div></div>
                  <div><div className="text-xs text-gray-400 mb-0.5">Raised By</div><div className="font-semibold text-sm text-[#0D1F3C]">{selected.raised_by_name} ({selected.raised_by_role})</div></div>
                  <div><div className="text-xs text-gray-400 mb-0.5">Description</div><div className="text-sm text-gray-700 leading-relaxed">{selected.description}</div></div>
                  {selected.evidence_text && <div><div className="text-xs text-gray-400 mb-0.5">Evidence</div><div className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{selected.evidence_text}</div></div>}
                </div>

                {selected.status !== "RESOLVED" && (
                  <>
                    <div className="flex gap-2 mb-4">
                      <button onClick={() => updateStatus(selected, "UNDER_REVIEW")} className="flex-1 py-2 rounded-lg text-xs font-semibold border border-amber-200 text-amber-600 hover:bg-amber-50 transition-all">Mark Under Review</button>
                    </div>
                    <form onSubmit={resolve} className="space-y-3 border-t border-gray-100 pt-4">
                      <h3 className="font-bold text-[#0D1F3C] text-sm">Make Ruling</h3>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Ruling *</label>
                        <select value={resolveForm.ruling_choice} onChange={(e) => setResolveForm({ ...resolveForm, ruling_choice: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500">
                          <option value="RELEASE_TO_SELLER">Release Funds to Seller</option>
                          <option value="REFUND_TO_BUYER">Refund to Buyer</option>
                          <option value="PARTIAL_SPLIT">Partial Split</option>
                        </select>
                      </div>
                      {resolveForm.ruling_choice === "PARTIAL_SPLIT" && (
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Seller Receives (%)</label>
                          <input type="number" min={0} max={100} value={resolveForm.ruling_split_percentage} onChange={(e) => setResolveForm({ ...resolveForm, ruling_split_percentage: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500" />
                        </div>
                      )}
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Admin Notes</label>
                        <textarea value={resolveForm.admin_notes} onChange={(e) => setResolveForm({ ...resolveForm, admin_notes: e.target.value })}
                          rows={3} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500 resize-none"
                          placeholder="Explain your ruling..." />
                      </div>
                      <button type="submit" disabled={resolveLoading} className="w-full py-3 rounded-full text-white font-semibold text-sm disabled:opacity-60" style={{ background: "#0D1F3C" }}>
                        {resolveLoading ? "Resolving..." : "Submit Ruling & Resolve"}
                      </button>
                    </form>
                  </>
                )}
                {selected.status === "RESOLVED" && (
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="font-semibold text-green-800 text-sm">Resolved</div>
                    <div className="text-green-700 text-xs mt-1">Ruling: {selected.ruling_choice?.replace(/_/g, " ")}</div>
                    {selected.admin_notes && <div className="text-green-600 text-xs mt-1">{selected.admin_notes}</div>}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 flex items-center justify-center p-12 text-center">
                <div>
                  <AlertTriangle className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">Select a dispute to review</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}