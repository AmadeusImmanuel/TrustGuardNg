import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, Trade, Transaction, Dispute, tradeActions } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import StatusBadge from "@/components/trades/StatusBadge";
import VirtualBankCard from "@/components/trades/VirtualBankCard";
import AutoReleaseTimer from "@/components/trades/AutoReleaseTimer";
import { CheckCircle, AlertTriangle, ChevronLeft } from "lucide-react";
import { jsPDF } from "jspdf";
export default function TradeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [trade, setTrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDispute, setShowDispute] = useState(false);
  const [dispForm, setDispForm] = useState({ description: "", evidence_text: "" });
  useEffect(() => {
    (async () => {
      try {
        const u = await auth.me();
        setUser(u);
        const t = await Trade.get(id);
        setTrade(t);
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, [id]);
  const isBuyer = trade?.buyer_id === user?.id;
  const isSeller = trade?.seller_id === user?.id;
  const confirmDelivery = async () => {
    if (!window.confirm("Confirm you have received the item?")) return;
    setActionLoading(true);
    try {
      const updated = await tradeActions.releaseFunds(trade.id);
      await Transaction.create({
        trade_id: trade.id, user_id: trade.seller_id,
        amount: trade.fee_payer === "SELLER" ? trade.amount - trade.calculated_fee : trade.fee_payer === "SPLIT_50_50" ? trade.amount - trade.calculated_fee / 2 : trade.amount,
        fee_collected: trade.calculated_fee, type: "Manual_Release", direction: "credit",
        description: `Funds released for: ${trade.item_name}`, status: "completed",
      });
      setTrade(updated);
    } catch (e) { alert(e.message); }
    setActionLoading(false);
  };

  const confirmPayment = async () => {
    if (!window.confirm("Confirm you have sent the bank transfer?")) return;
    setActionLoading(true);
    try {
      const updated = await tradeActions.confirmPayment(trade.id);
      setTrade(updated);
    } catch (e) { alert(e.message); }
    setActionLoading(false);
  };
  const raiseDispute = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await Dispute.create({
        transaction_id: trade.id, user_id: user.id,
        reason: dispForm.description, evidence: { text: dispForm.evidence_text },
        status: "OPEN", amount: trade.amount,
      });
      const updated = await Trade.update(trade.id, { status: "Disputed" });
      setTrade(updated);
      setShowDispute(false);
    } catch (e) { alert(e.message); }
    setActionLoading(false);
  };
  const downloadReceipt = () => {
    const doc = new jsPDF();
    doc.setFillColor(13, 31, 60);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("TrustGuard Nigeria", 15, 20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Escrow Transaction Receipt", 15, 30);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    let y = 55;
    const row = (label, value) => { doc.setFont("helvetica", "bold"); doc.text(label + ":", 15, y); doc.setFont("helvetica", "normal"); doc.text(String(value || "—"), 80, y); y += 10; };
    row("Reference", trade.reference);
    row("Item", trade.item_name);
    row("Amount", `₦${(Number(trade.amount) || 0).toLocaleString()}`);
    row("Escrow Fee", `₦${(Number(trade.calculated_fee) || 0).toFixed(2)}`);
    row("Status", trade.status);
    row("Created", new Date(trade.created_date).toLocaleString("en-NG"));
    doc.save(`TrustGuard-Receipt-${trade.reference}.pdf`);
  };
  if (loading) return <AppLayout user={user}><div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" /></div></AppLayout>;
  if (!trade) return <AppLayout user={user}><div className="max-w-2xl mx-auto px-4 py-20 text-center"><p className="text-gray-500">Trade not found.</p></div></AppLayout>;
  return (
    <AppLayout user={user}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => navigate("/trades")} className="flex items-center gap-1 text-gray-400 hover:text-gray-700 text-sm mb-6"><ChevronLeft className="w-4 h-4" /> Back to Trades</button>
        <div className="flex items-start justify-between mb-6">
          <div><h1 className="text-2xl font-black text-[#0D1F3C]">{trade.item_name}</h1><p className="text-gray-400 text-sm mt-1">Ref: {trade.reference}</p></div>
          <StatusBadge status={trade.status} />
        </div>
        {trade.status === "Awaiting_Payment" && isBuyer && (
          <>
            <VirtualBankCard trade={trade} />
            <button
              onClick={confirmPayment}
              disabled={actionLoading}
              className="w-full mt-4 py-3.5 rounded-full text-white font-semibold disabled:opacity-60"
              style={{ background: "#00A651" }}
            >
              {actionLoading ? "Confirming..." : "I've Sent the Transfer"}
            </button>
          </>
        )}
        {trade.status === "Shipped" && trade.auto_release_at && <AutoReleaseTimer autoReleaseAt={trade.auto_release_at} isBuyer={isBuyer} />}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4 space-y-4">
          <h2 className="font-bold text-[#0D1F3C]">Trade Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><div className="text-gray-400 text-xs mb-1">Amount</div><div className="font-bold text-[#0D1F3C]">₦{(Number(trade.amount) || 0).toLocaleString()}</div></div>
            <div><div className="text-gray-400 text-xs mb-1">Escrow Fee</div><div className="font-bold text-[#0D1F3C]">₦{(Number(trade.calculated_fee) || 0).toFixed(2)}</div></div>
            <div><div className="text-gray-400 text-xs mb-1">Fee Paid By</div><div className="font-semibold text-sm text-[#0D1F3C]">{trade.fee_payer?.replace("_", " ")}</div></div>
            <div><div className="text-gray-400 text-xs mb-1">Your Role</div><div className="font-semibold text-sm text-[#0D1F3C]">{isBuyer ? "Buyer" : "Seller"}</div></div>
          </div>
          {trade.item_description && <div><div className="text-gray-400 text-xs mb-1">Description</div><div className="text-gray-700 text-sm">{trade.item_description}</div></div>}
        </div>
        {trade.status === "Funded" && isSeller && <ShipForm trade={trade} onShipped={setTrade} />}
        <div className="flex flex-col gap-3">
          {trade.status === "Shipped" && isBuyer && (
            <>
              <button onClick={confirmDelivery} disabled={actionLoading} className="flex items-center justify-center gap-2 py-3.5 rounded-full text-white font-semibold disabled:opacity-60" style={{ background: "#00A651" }}>
                <CheckCircle className="w-5 h-5" /> Confirm Delivery & Release Funds
              </button>
              <button onClick={() => setShowDispute(true)} className="flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-red-600 border border-red-200 bg-red-50">
                <AlertTriangle className="w-5 h-5" /> Raise a Dispute
              </button>
            </>
          )}
          {["Confirmed", "Resolved"].includes(trade.status) && (
            <button onClick={downloadReceipt} className="flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-[#0D1F3C] border border-gray-200 bg-white">
              Download Receipt (PDF)
            </button>
          )}
        </div>
        {showDispute && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h2 className="font-bold text-[#0D1F3C] text-lg mb-4">Raise a Dispute</h2>
              <form onSubmit={raiseDispute} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">What is the issue? *</label>
                  <textarea required value={dispForm.description} onChange={(e) => setDispForm({ ...dispForm, description: e.target.value })} rows={4} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none resize-none" placeholder="Describe the problem..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Supporting Evidence</label>
                  <textarea value={dispForm.evidence_text} onChange={(e) => setDispForm({ ...dispForm, evidence_text: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none resize-none" placeholder="Any additional context..." />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowDispute(false)} className="flex-1 py-3 rounded-full border border-gray-200 text-sm font-semibold text-gray-600">Cancel</button>
                  <button type="submit" disabled={actionLoading} className="flex-1 py-3 rounded-full text-white text-sm font-semibold bg-red-500 disabled:opacity-60">{actionLoading ? "Submitting..." : "Submit Dispute"}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
function ShipForm({ trade, onShipped }) {
  const [form, setForm] = useState({ dispatch_company: "", rider_name: "", rider_phone: "", tracking_code: "" });
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await Trade.update(trade.id, {
        status: "Shipped", shipped_at: new Date().toISOString(),
        auto_release_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        ...form,
      });
      onShipped(updated);
    } catch (e) { alert(e.message); }
    setLoading(false);
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
      <h2 className="font-bold text-[#0D1F3C] mb-4">Mark as Shipped</h2>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-xs font-semibold text-gray-600 mb-1">Dispatch Company *</label><input required value={form.dispatch_company} onChange={(e) => setForm({ ...form, dispatch_company: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" placeholder="e.g. GIG Logistics" /></div>
          <div><label className="block text-xs font-semibold text-gray-600 mb-1">Rider Name</label><input value={form.rider_name} onChange={(e) => setForm({ ...form, rider_name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" placeholder="Optional" /></div>
          <div><label className="block text-xs font-semibold text-gray-600 mb-1">Rider Phone</label><input value={form.rider_phone} onChange={(e) => setForm({ ...form, rider_phone: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" placeholder="08012345678" /></div>
          <div><label className="block text-xs font-semibold text-gray-600 mb-1">Tracking Code</label><input value={form.tracking_code} onChange={(e) => setForm({ ...form, tracking_code: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" placeholder="Optional" /></div>
        </div>
        <button type="submit" disabled={loading} className="w-full py-3 rounded-full text-white font-semibold text-sm disabled:opacity-60" style={{ background: "#00A651" }}>{loading ? "Updating..." : "Mark as Shipped →"}</button>
      </form>
    </div>
  );
}
