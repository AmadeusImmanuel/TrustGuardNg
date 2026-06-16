import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import StatusBadge from "@/components/trades/StatusBadge";
import VirtualBankCard from "@/components/trades/VirtualBankCard";
import AutoReleaseTimer from "@/components/trades/AutoReleaseTimer";
import { Package, CheckCircle, AlertTriangle, Copy, ChevronLeft } from "lucide-react";
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
      const u = await base44.auth.me();
      setUser(u);
      const t = await base44.entities.Trade.filter({ id });
      setTrade(t[0] || null);
      setLoading(false);
    })();
  }, [id]);

  const isBuyer = trade?.buyer_id === user?.id;
  const isSeller = trade?.seller_id === user?.id;

  const sendNotification = async (tradeId, newStatus) => {
    try {
      await base44.functions.invoke("tradeStatusNotification", { trade_id: tradeId, new_status: newStatus });
    } catch (e) {
      console.error("Notification failed:", e);
    }
  };

  const markShipped = async () => {
    if (!window.confirm("Confirm you have shipped this item?")) return;
    setActionLoading(true);
    const shippedAt = new Date().toISOString();
    const autoRelease = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
    const updated = await base44.entities.Trade.update(trade.id, {
      status: "Shipped",
      shipped_at: shippedAt,
      auto_release_at: autoRelease,
    });
    setTrade(updated);
    await sendNotification(trade.id, "Shipped");
    setActionLoading(false);
  };

  const confirmDelivery = async () => {
    if (!window.confirm("Confirm you have received the item and are satisfied?")) return;
    setActionLoading(true);
    const updated = await base44.entities.Trade.update(trade.id, {
      status: "Confirmed",
      confirmed_at: new Date().toISOString(),
    });
    await base44.entities.Transaction.create({
      trade_id: trade.id,
      trade_reference: trade.reference,
      user_id: trade.seller_id,
      amount: trade.fee_payer === "SELLER" ? trade.amount - trade.calculated_fee : trade.fee_payer === "SPLIT_50_50" ? trade.amount - trade.calculated_fee / 2 : trade.amount,
      fee_collected: trade.calculated_fee,
      type: "Manual_Release",
      direction: "credit",
      description: `Funds released for: ${trade.item_name}`,
      status: "completed",
    });
    setTrade(updated);
    await sendNotification(trade.id, "Confirmed");
    setActionLoading(false);
  };

  const raiseDispute = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    await base44.entities.Dispute.create({
      trade_id: trade.id,
      trade_reference: trade.reference,
      raised_by_id: user.id,
      raised_by_name: user.full_name,
      raised_by_role: isBuyer ? "buyer" : "seller",
      description: dispForm.description,
      evidence_text: dispForm.evidence_text,
      status: "OPEN",
    });
    const updated = await base44.entities.Trade.update(trade.id, { status: "Disputed" });
    setTrade(updated);
    await sendNotification(trade.id, "Disputed");
    setShowDispute(false);
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
    const row = (label, value) => {
      doc.setFont("helvetica", "bold");
      doc.text(label + ":", 15, y);
      doc.setFont("helvetica", "normal");
      doc.text(String(value || "—"), 80, y);
      y += 10;
    };

    row("Reference", trade.reference);
    row("Item", trade.item_name);
    row("Description", trade.item_description || "—");
    row("Amount", `₦${(trade.amount || 0).toLocaleString()}`);
    row("Escrow Fee", `₦${(trade.calculated_fee || 0).toFixed(2)}`);
    row("Fee Paid By", trade.fee_payer);
    row("Buyer", trade.buyer_name || trade.buyer_email);
    row("Seller", trade.seller_name || trade.seller_email);
    row("Status", trade.status);
    row("Created", new Date(trade.created_date).toLocaleString("en-NG"));
    if (trade.confirmed_at) row("Confirmed", new Date(trade.confirmed_at).toLocaleString("en-NG"));

    doc.save(`TrustGuard-Receipt-${trade.reference}.pdf`);
  };

  if (loading) {
    return (
      <AppLayout user={user}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!trade) {
    return (
      <AppLayout user={user}>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <p className="text-gray-500">Trade not found.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={user}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back */}
        <button
          onClick={() => navigate("/trades")}
          className="flex items-center gap-1 text-gray-400 hover:text-gray-700 text-sm mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Trades
        </button>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-[#0D1F3C]">{trade.item_name}</h1>
            <p className="text-gray-400 text-sm mt-1">Ref: {trade.reference}</p>
          </div>
          <StatusBadge status={trade.status} />
        </div>

        {/* Virtual bank card for awaiting payment */}
        {trade.status === "Awaiting_Payment" && isBuyer && (
          <VirtualBankCard trade={trade} />
        )}

        {/* Auto-release timer for shipped */}
        {trade.status === "Shipped" && trade.auto_release_at && (
          <AutoReleaseTimer autoReleaseAt={trade.auto_release_at} isBuyer={isBuyer} />
        )}

        {/* Trade info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4 space-y-4">
          <h2 className="font-bold text-[#0D1F3C]">Trade Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-gray-400 text-xs mb-1">Trade Amount</div>
              <div className="font-bold text-[#0D1F3C]">₦{(trade.amount || 0).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs mb-1">Escrow Fee</div>
              <div className="font-bold text-[#0D1F3C]">₦{(trade.calculated_fee || 0).toFixed(2)}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs mb-1">Fee Paid By</div>
              <div className="font-semibold text-[#0D1F3C] text-sm">{trade.fee_payer?.replace("_", " ")}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs mb-1">Your Role</div>
              <div className="font-semibold text-[#0D1F3C] text-sm capitalize">{isBuyer ? "Buyer" : "Seller"}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs mb-1">{isBuyer ? "Seller" : "Buyer"}</div>
              <div className="font-semibold text-[#0D1F3C] text-sm">{isBuyer ? (trade.seller_name || trade.seller_email) : (trade.buyer_name || trade.buyer_email)}</div>
            </div>
            {trade.delivery_deadline && (
              <div>
                <div className="text-gray-400 text-xs mb-1">Delivery By</div>
                <div className="font-semibold text-[#0D1F3C] text-sm">{new Date(trade.delivery_deadline).toLocaleDateString("en-NG")}</div>
              </div>
            )}
          </div>
          {trade.item_description && (
            <div>
              <div className="text-gray-400 text-xs mb-1">Description</div>
              <div className="text-gray-700 text-sm leading-relaxed">{trade.item_description}</div>
            </div>
          )}
        </div>

        {/* Dispatch info */}
        {trade.status !== "Awaiting_Payment" && trade.status !== "Funded" && trade.dispatch_company && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
            <h2 className="font-bold text-[#0D1F3C] mb-4">Dispatch Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><div className="text-gray-400 text-xs mb-1">Dispatch Company</div><div className="font-semibold text-sm text-[#0D1F3C]">{trade.dispatch_company}</div></div>
              {trade.rider_name && <div><div className="text-gray-400 text-xs mb-1">Rider Name</div><div className="font-semibold text-sm text-[#0D1F3C]">{trade.rider_name}</div></div>}
              {trade.rider_phone && (
                <div>
                  <div className="text-gray-400 text-xs mb-1">Rider Phone</div>
                  <a href={`tel:${trade.rider_phone}`} className="font-semibold text-sm" style={{ color: "#00A651" }}>{trade.rider_phone}</a>
                </div>
              )}
              {trade.tracking_code && <div><div className="text-gray-400 text-xs mb-1">Tracking Code</div><div className="font-semibold text-sm text-[#0D1F3C]">{trade.tracking_code}</div></div>}
            </div>
          </div>
        )}

        {/* Seller: mark shipped form */}
        {trade.status === "Funded" && isSeller && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
            <h2 className="font-bold text-[#0D1F3C] mb-4">Mark as Shipped</h2>
            <ShipForm trade={trade} onShipped={setTrade} />
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {trade.status === "Shipped" && isBuyer && (
            <>
              <button
                onClick={confirmDelivery}
                disabled={actionLoading}
                className="flex items-center justify-center gap-2 py-3.5 rounded-full text-white font-semibold disabled:opacity-60"
                style={{ background: "#00A651" }}
              >
                <CheckCircle className="w-5 h-5" />
                Confirm Delivery & Release Funds
              </button>
              <button
                onClick={() => setShowDispute(true)}
                className="flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
              >
                <AlertTriangle className="w-5 h-5" />
                Raise a Dispute
              </button>
            </>
          )}
          {["Confirmed", "Resolved"].includes(trade.status) && (
            <button
              onClick={downloadReceipt}
              className="flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-[#0D1F3C] border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
            >
              Download Receipt (PDF)
            </button>
          )}
        </div>

        {/* Dispute Form */}
        {showDispute && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h2 className="font-bold text-[#0D1F3C] text-lg mb-4">Raise a Dispute</h2>
              <form onSubmit={raiseDispute} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">What is the issue? *</label>
                  <textarea
                    required
                    value={dispForm.description}
                    onChange={(e) => setDispForm({ ...dispForm, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400 resize-none"
                    placeholder="Describe the problem in detail..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Supporting Evidence</label>
                  <textarea
                    value={dispForm.evidence_text}
                    onChange={(e) => setDispForm({ ...dispForm, evidence_text: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400 resize-none"
                    placeholder="Any additional context, timestamps, agreements..."
                  />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowDispute(false)} className="flex-1 py-3 rounded-full border border-gray-200 text-sm font-semibold text-gray-600">Cancel</button>
                  <button type="submit" disabled={actionLoading} className="flex-1 py-3 rounded-full text-white text-sm font-semibold bg-red-500 disabled:opacity-60">
                    {actionLoading ? "Submitting..." : "Submit Dispute"}
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

function ShipForm({ trade, onShipped }) {
  const [form, setForm] = useState({ dispatch_company: "", rider_name: "", rider_phone: "", tracking_code: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const shippedAt = new Date().toISOString();
    const autoRelease = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
    const updated = await base44.entities.Trade.update(trade.id, {
      status: "Shipped",
      shipped_at: shippedAt,
      auto_release_at: autoRelease,
      dispatch_company: form.dispatch_company,
      rider_name: form.rider_name,
      rider_phone: form.rider_phone,
      tracking_code: form.tracking_code,
    });
    onShipped(updated);
    try {
      await base44.functions.invoke("tradeStatusNotification", { trade_id: trade.id, new_status: "Shipped" });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Dispatch Company *</label>
          <input required value={form.dispatch_company} onChange={(e) => setForm({ ...form, dispatch_company: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500"
            placeholder="e.g. GIG Logistics" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Rider Name</label>
          <input value={form.rider_name} onChange={(e) => setForm({ ...form, rider_name: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500"
            placeholder="Optional" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Rider Phone</label>
          <input value={form.rider_phone} onChange={(e) => setForm({ ...form, rider_phone: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500"
            placeholder="08012345678" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Tracking Code</label>
          <input value={form.tracking_code} onChange={(e) => setForm({ ...form, tracking_code: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500"
            placeholder="Optional" />
        </div>
      </div>
      <button type="submit" disabled={loading} className="w-full py-3 rounded-full text-white font-semibold text-sm disabled:opacity-60" style={{ background: "#00A651" }}>
        {loading ? "Updating..." : "Mark as Shipped →"}
      </button>
    </form>
  );
}