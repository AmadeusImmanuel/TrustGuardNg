import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, Trade, Transaction, Dispute, tradeActions, tradeSellerActions, request, Reviews, PaystackAPI } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import StatusBadge from "@/components/trades/StatusBadge";
import VirtualBankCard from "@/components/trades/VirtualBankCard";
import AutoReleaseTimer from "@/components/trades/AutoReleaseTimer";
import TrustBadge from "@/components/TrustBadge";
import ReviewModal from "@/components/ReviewModal";
import TradeQRCode from "@/components/TradeQRCode";
import UserReviews from "@/components/UserReviews";
import { CheckCircle, AlertTriangle, ChevronLeft, Clock, XCircle, MessageSquareWarning } from "lucide-react";
import PaystackButton from "@/components/PaystackButton";
import { jsPDF } from "jspdf";

export default function TradeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [trade, setTrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDispute, setShowDispute] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [paymentBanner, setPaymentBanner] = useState(null);
  const [dispForm, setDispForm] = useState({ description: "", evidence_text: "" });

  const [sellerNote, setSellerNote] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showModifyForm, setShowModifyForm] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const u = await auth.me();
        setUser(u);
        const t = await Trade.get(id);
        setTrade(t);
        if (["Confirmed", "Resolved"].includes(t.status)) {
          Reviews.forTrade(t.id).then(r => setAlreadyReviewed(!!r)).catch(() => {});
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, [id]);

  const isBuyer = trade?.buyer_id === user?.id;
  const isSeller = trade?.seller_id === user?.id;

  const acceptTrade = async () => {
    setActionLoading(true);
    try {
      const updated = await tradeSellerActions.accept(trade.id);
      setTrade(updated);
    } catch (e) { alert(e.message); }
    setActionLoading(false);
  };

  const rejectTrade = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const updated = await tradeSellerActions.reject(trade.id, sellerNote);
      setTrade(updated);
      setShowRejectForm(false);
      setSellerNote("");
    } catch (e) { alert(e.message); }
    setActionLoading(false);
  };

  const requestModification = async (e) => {
    e.preventDefault();
    if (!sellerNote.trim()) return;
    setActionLoading(true);
    try {
      await tradeSellerActions.requestModification(trade.id, sellerNote);
      setTrade({ ...trade, seller_message: sellerNote });
      setShowModifyForm(false);
      setSellerNote("");
    } catch (e) { alert(e.message); }
    setActionLoading(false);
  };

  const confirmDelivery = async () => {
    if (!window.confirm("Confirm you have received the item?")) return;
    setActionLoading(true);
    try {
      // The backend now creates the transaction/ledger record itself,
      // atomically with the wallet credit — no separate client-side
      // Transaction.create() call needed (that used to risk a mismatch
      // between the credited wallet and the recorded ledger entry if this
      // second request ever failed independently).
      const updated = await tradeActions.releaseFunds(trade.id);
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
    doc.setFillColor(14, 29, 54);
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

  if (loading) return <AppLayout user={user}><div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" /></div></AppLayout>;
  if (!trade) return <AppLayout user={user}><div className="max-w-2xl mx-auto px-4 py-20 text-center"><p className="text-muted">Trade not found.</p></div></AppLayout>;

  return (
    <AppLayout user={user}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => navigate("/trades")} className="flex items-center gap-1 text-muted hover:text-foreground text-sm mb-6"><ChevronLeft className="w-4 h-4" /> Back to Trades</button>
        {paymentBanner === "success" && (
          <div className="mb-4 px-5 py-4 rounded-2xl text-primary-foreground flex items-center gap-3 bg-primary">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <div className="text-sm font-semibold">Payment successful! Your funds are now held securely in escrow.</div>
          </div>
        )}
        {paymentBanner === "cancelled" && (
          <div className="mb-4 px-5 py-4 rounded-2xl bg-warning/10 border border-warning/30 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
            <div className="text-sm font-semibold text-warning">Payment was cancelled. You can try again below.</div>
          </div>
        )}
        <div className="flex items-start justify-between mb-6">
          <div><h1 className="text-2xl font-black text-foreground">{trade.item_name}</h1><p className="text-muted text-sm mt-1">Ref: {trade.reference}</p></div>
          <StatusBadge status={trade.status} />
        </div>

        {trade.status === "Pending_Acceptance" && isSeller && (
          <div className="bg-card rounded-2xl border border-border p-6 mb-4">
            <div className="flex items-center gap-2 text-warning text-sm font-semibold mb-3">
              <Clock className="w-4 h-4" /> This trade is waiting for your response
            </div>
            <p className="text-text-secondary text-sm mb-5">
              {trade.buyer_name || trade.buyer_email} wants to start an escrow trade with you for <strong className="text-foreground">{trade.item_name}</strong> at ₦{(Number(trade.amount) || 0).toLocaleString()}. Review the details below, then accept, reject, or ask for changes.
            </p>

            {!showRejectForm && !showModifyForm && (
              <div className="grid grid-cols-3 gap-3">
                <button onClick={acceptTrade} disabled={actionLoading}
                  className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-primary-foreground font-semibold text-sm disabled:opacity-60 bg-primary hover:bg-primary-hover transition-colors">
                  <CheckCircle className="w-4 h-4" /> Accept
                </button>
                <button onClick={() => setShowModifyForm(true)}
                  className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-warning font-semibold text-sm border border-warning/30 bg-warning/10 hover:bg-warning/20 transition-colors">
                  <MessageSquareWarning className="w-4 h-4" /> Request Changes
                </button>
                <button onClick={() => setShowRejectForm(true)}
                  className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-danger font-semibold text-sm border border-danger/30 bg-danger/10 hover:bg-danger/20 transition-colors">
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            )}

            {showRejectForm && (
              <form onSubmit={rejectTrade} className="space-y-3">
                <textarea value={sellerNote} onChange={e => setSellerNote(e.target.value)} rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-danger/30 bg-background text-foreground text-sm focus:outline-none resize-none"
                  placeholder="Optional: let the buyer know why (sent to them)..." />
                <div className="flex gap-3">
                  <button type="button" onClick={() => { setShowRejectForm(false); setSellerNote(""); }} className="flex-1 py-2.5 rounded-full border border-border text-sm font-semibold text-text-secondary">Cancel</button>
                  <button type="submit" disabled={actionLoading} className="flex-1 py-2.5 rounded-full text-white text-sm font-semibold bg-danger hover:opacity-90 disabled:opacity-60 transition-opacity">
                    {actionLoading ? "Rejecting..." : "Confirm Reject"}
                  </button>
                </div>
              </form>
            )}

            {showModifyForm && (
              <form onSubmit={requestModification} className="space-y-3">
                <textarea required value={sellerNote} onChange={e => setSellerNote(e.target.value)} rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-warning/30 bg-background text-foreground text-sm focus:outline-none resize-none"
                  placeholder="What would you like changed? (e.g. price, item details)" />
                <div className="flex gap-3">
                  <button type="button" onClick={() => { setShowModifyForm(false); setSellerNote(""); }} className="flex-1 py-2.5 rounded-full border border-border text-sm font-semibold text-text-secondary">Cancel</button>
                  <button type="submit" disabled={actionLoading} className="flex-1 py-2.5 rounded-full text-primary-foreground text-sm font-semibold bg-warning hover:opacity-90 disabled:opacity-60 transition-opacity">
                    {actionLoading ? "Sending..." : "Send Request"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {trade.status === "Pending_Acceptance" && isBuyer && (
          <div className="bg-card rounded-2xl border border-border p-6 mb-4 text-center">
            <Clock className="w-8 h-8 text-warning mx-auto mb-3" />
            <div className="font-bold text-foreground mb-1">Waiting for {trade.seller_name || trade.seller_email} to respond</div>
            <p className="text-muted text-sm">You'll get a bank transfer account as soon as the seller accepts this trade.</p>
            {trade.seller_message && (
              <div className="mt-4 text-left bg-warning/10 border border-warning/30 rounded-xl p-4">
                <div className="text-xs font-semibold text-warning mb-1">Message from seller</div>
                <p className="text-sm text-text-secondary">{trade.seller_message}</p>
              </div>
            )}
          </div>
        )}

        {trade.status === "Rejected" && (
          <div className="bg-danger/10 border border-danger/30 rounded-2xl p-6 mb-4 text-center">
            <XCircle className="w-8 h-8 text-danger mx-auto mb-3" />
            <div className="font-bold text-danger mb-1">This trade was rejected</div>
            {trade.seller_message && <p className="text-text-secondary text-sm mt-2">{trade.seller_message}</p>}
          </div>
        )}

        {trade.status === "Awaiting_Payment" && isBuyer && (
          <>
            <PaystackButton trade={trade} user={user} />
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted font-semibold">OR PAY VIA BANK TRANSFER</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <VirtualBankCard trade={trade} />
            <button
              onClick={confirmPayment}
              disabled={actionLoading}
              className="w-full mt-4 py-3.5 rounded-full text-primary-foreground font-semibold disabled:opacity-60 bg-primary hover:bg-primary-hover transition-colors"
            >
              {actionLoading ? "Confirming..." : "I've Sent the Transfer"}
            </button>
          </>
        )}
        {trade.status === "Shipped" && trade.auto_release_at && <AutoReleaseTimer autoReleaseAt={trade.auto_release_at} isBuyer={isBuyer} />}
        <div className="bg-card rounded-2xl border border-border p-6 mb-4 space-y-4">
          <h2 className="font-bold text-foreground">Trade Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><div className="text-muted text-xs mb-1">Amount</div><div className="font-bold text-foreground">₦{(Number(trade.amount) || 0).toLocaleString()}</div></div>
            <div><div className="text-muted text-xs mb-1">Escrow Fee</div><div className="font-bold text-foreground">₦{(Number(trade.calculated_fee) || 0).toFixed(2)}</div></div>
            <div><div className="text-muted text-xs mb-1">Fee Paid By</div><div className="font-semibold text-sm text-foreground">{trade.fee_payer?.replace("_", " ")}</div></div>
            <div><div className="text-muted text-xs mb-1">Your Role</div><div className="font-semibold text-sm text-foreground">{isBuyer ? "Buyer" : "Seller"}</div></div>
            {user?.trust_level && <div><div className="text-muted text-xs mb-1">Your Trust Level</div><TrustBadge level={user.trust_level} score={user.trust_score || 0} size="sm" /></div>}
            <div>
              <div className="text-muted text-xs mb-1">{isBuyer ? "Seller" : "Buyer"} Profile</div>
              {(isBuyer ? trade.seller_id : trade.buyer_id) ? (
                <a href={`/profile/${isBuyer ? trade.seller_id : trade.buyer_id}`}
                  className="text-sm font-semibold text-primary hover:underline">
                  View {isBuyer ? (trade.seller_name || trade.seller_email) : (trade.buyer_name || trade.buyer_email)}'s Profile →
                </a>
              ) : (
                <div className="text-sm text-muted">{isBuyer ? trade.seller_email : trade.buyer_email}</div>
              )}
            </div>
          </div>
          {trade.item_description && <div><div className="text-muted text-xs mb-1">Description</div><div className="text-text-secondary text-sm">{trade.item_description}</div></div>}
        </div>
        {trade.status === "Funded" && isSeller && <ShipForm trade={trade} onShipped={setTrade} />}
        {/* QR Code */}
        <TradeQRCode trade={trade} />

        <div className="flex flex-col gap-3">
          {trade.status === "Shipped" && isBuyer && (
            <>
              <button onClick={confirmDelivery} disabled={actionLoading} className="flex items-center justify-center gap-2 py-3.5 rounded-full text-primary-foreground font-semibold disabled:opacity-60 bg-primary hover:bg-primary-hover transition-colors">
                <CheckCircle className="w-5 h-5" /> Confirm Delivery & Release Funds
              </button>
              <button onClick={() => setShowDispute(true)} className="flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-danger border border-danger/30 bg-danger/10 hover:bg-danger/20 transition-colors">
                <AlertTriangle className="w-5 h-5" /> Raise a Dispute
              </button>
            </>
          )}
          {["Confirmed", "Resolved"].includes(trade.status) && (
            <button onClick={downloadReceipt} className="flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-foreground border border-border bg-card hover:bg-card-hover transition-colors">
              Download Receipt (PDF)
            </button>
          )}
          {["Confirmed", "Resolved"].includes(trade.status) && !alreadyReviewed && (trade.seller_id || trade.buyer_id) && (
            <button onClick={() => setShowReview(true)}
              className="flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-primary-foreground bg-foreground hover:opacity-90 transition-opacity">
              ⭐ Leave a Review
            </button>
          )}
          {alreadyReviewed && (
            <div className="text-center text-sm text-muted py-2">✓ You have reviewed this trade</div>
          )}
        </div>
        {["Confirmed", "Resolved"].includes(trade.status) && (
          <div className="mt-6">
            <UserReviews userId={isBuyer ? trade.seller_id : trade.buyer_id} />
          </div>
        )}

        {showReview && (
          <ReviewModal
            trade={trade}
            currentUser={user}
            onClose={() => setShowReview(false)}
            onSubmitted={() => { setAlreadyReviewed(true); setShowReview(false); }}
          />
        )}

        {showDispute && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md">
              <h2 className="font-bold text-foreground text-lg mb-4">Raise a Dispute</h2>
              <form onSubmit={raiseDispute} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-1.5">What is the issue? *</label>
                  <textarea required value={dispForm.description} onChange={(e) => setDispForm({ ...dispForm, description: e.target.value })} rows={4} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none resize-none" placeholder="Describe the problem..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-1.5">Supporting Evidence</label>
                  <textarea value={dispForm.evidence_text} onChange={(e) => setDispForm({ ...dispForm, evidence_text: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none resize-none" placeholder="Any additional context..." />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowDispute(false)} className="flex-1 py-3 rounded-full border border-border text-sm font-semibold text-text-secondary">Cancel</button>
                  <button type="submit" disabled={actionLoading} className="flex-1 py-3 rounded-full text-white text-sm font-semibold bg-danger disabled:opacity-60 hover:opacity-90 transition-opacity">{actionLoading ? "Submitting..." : "Submit Dispute"}</button>
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
    <div className="bg-card rounded-2xl border border-border p-6 mb-4">
      <h2 className="font-bold text-foreground mb-4">Mark as Shipped</h2>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-xs font-semibold text-text-secondary mb-1">Dispatch Company *</label><input required value={form.dispatch_company} onChange={(e) => setForm({ ...form, dispatch_company: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none" placeholder="e.g. GIG Logistics" /></div>
          <div><label className="block text-xs font-semibold text-text-secondary mb-1">Rider Name</label><input value={form.rider_name} onChange={(e) => setForm({ ...form, rider_name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none" placeholder="Optional" /></div>
          <div><label className="block text-xs font-semibold text-text-secondary mb-1">Rider Phone</label><input value={form.rider_phone} onChange={(e) => setForm({ ...form, rider_phone: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none" placeholder="08012345678" /></div>
          <div><label className="block text-xs font-semibold text-text-secondary mb-1">Tracking Code</label><input value={form.tracking_code} onChange={(e) => setForm({ ...form, tracking_code: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none" placeholder="Optional" /></div>
        </div>
        <button type="submit" disabled={loading} className="w-full py-3 rounded-full text-primary-foreground font-semibold text-sm disabled:opacity-60 bg-primary hover:bg-primary-hover transition-colors">{loading ? "Updating..." : "Mark as Shipped →"}</button>
      </form>
    </div>
  );
}
