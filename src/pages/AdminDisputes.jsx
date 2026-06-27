import React, { useEffect, useState } from "react";
import { auth, Dispute, Trade, disputeActions } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
export default function AdminDisputes() {
  const [user, setUser] = useState(null);
  const [disputes, setDisputes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [ruling, setRuling] = useState("");
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
  const updateStatus = async (d, status) => {
    await Dispute.update(d.id, { status });
    setDisputes(disputes.map((x) => x.id === d.id ? { ...x, status } : x));
  };
  const resolve = async () => {
    if (!selected || !ruling) return;
    try {
      await disputeActions.resolve(selected.id, ruling, note);
      const all = await Dispute.list();
      setDisputes(all);
      setSelected(null);
      setNote("");
      setRuling("");
    } catch (e) { alert(e.message); }
  };
  const statusColors = { OPEN: "#dc2626", UNDER_REVIEW: "#d97706", RESOLVED: "#059669" };
  return (
    <AppLayout user={user}>
      <div className="max-w-6xl mx-auto px-4 py-8 flex gap-6">
        <div className="w-80 shrink-0">
          <h1 className="text-xl font-black text-[#0D1F3C] mb-4">Disputes</h1>
          {loading ? <div className="flex justify-center py-10"><div className="w-6 h-6 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" /></div> : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {disputes.map((d) => (
                <button key={d.id} onClick={() => setSelected(d)} className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 ${selected?.id === d.id ? "bg-green-50" : ""}`}>
                  <div className="text-sm font-semibold text-[#0D1F3C] truncate">{d.reason?.substring(0, 40) || "Dispute"}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold" style={{ color: statusColors[d.status] || "#dc2626" }}>{d.status}</span>
                    <span className="text-xs text-gray-400">{new Date(d.created_date).toLocaleDateString("en-NG")}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex-1">
          {!selected ? (
            <div className="bg-white rounded-2xl border border-gray-100 flex items-center justify-center h-64">
              <p className="text-gray-400">Select a dispute to review</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-[#0D1F3C]">Dispute Details</h2>
                <select value={selected.status} onChange={(e) => updateStatus(selected, e.target.value)} className="px-3 py-1.5 rounded-xl border border-gray-200 text-sm focus:outline-none">
                  <option value="OPEN">Open</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>
              <div className="space-y-3 mb-6">
                <div><div className="text-xs text-gray-400 mb-1">Reason</div><div className="text-sm text-gray-700">{selected.reason}</div></div>
                <div><div className="text-xs text-gray-400 mb-1">Amount</div><div className="font-bold text-[#0D1F3C]">₦{(Number(selected.amount) || 0).toLocaleString()}</div></div>
                {selected.evidence?.text && <div><div className="text-xs text-gray-400 mb-1">Evidence</div><div className="text-sm text-gray-700">{selected.evidence.text}</div></div>}
              </div>
              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-bold text-[#0D1F3C] mb-3">Admin Ruling</h3>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none resize-none mb-3" placeholder="Admin notes and resolution..." />
                <div className="flex gap-3">
                  {["refund", "release", "split"].map((r) => (
                    <button key={r} onClick={() => setRuling(r)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${ruling === r ? "text-white border-transparent" : "border-gray-200 text-gray-600"}`} style={ruling === r ? { background: "#00A651" } : {}}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
                <button onClick={resolve} disabled={!ruling} className="mt-3 w-full py-3 rounded-full text-white font-bold text-sm disabled:opacity-40" style={{ background: "#0D1F3C" }}>
                  Apply Ruling
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
