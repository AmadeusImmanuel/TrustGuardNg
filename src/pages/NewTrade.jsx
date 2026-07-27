import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, Trade, Transaction, userLookup, platformSettings } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import { Info, Clock, Mail } from "lucide-react";

export default function NewTrade() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [createdTrade, setCreatedTrade] = useState(null);
  const [feeRate, setFeeRate] = useState(0.015);
  const [form, setForm] = useState({ item_name: "", item_description: "", amount: "", seller_email: "", delivery_deadline: "", fee_payer: "BUYER" });

  useEffect(() => { auth.me().then(setUser).catch(() => {}); }, []);
  useEffect(() => { platformSettings.getFeeRate().then((r) => setFeeRate(r.fee_rate)).catch(() => {}); }, []);

  const amount = parseFloat(form.amount) || 0;
  const fee = amount * feeRate;
  const buyerPays = form.fee_payer === "BUYER" ? amount + fee : form.fee_payer === "SPLIT_50_50" ? amount + fee / 2 : amount;
  const sellerReceives = form.fee_payer === "SELLER" ? amount - fee : form.fee_payer === "SPLIT_50_50" ? amount - fee / 2 : amount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const ref = "TG-" + Math.random().toString(36).substring(2, 8).toUpperCase();
      let sellerId = null;
      let sellerName = null;
      try {
        const sellerUser = await userLookup.byEmail(form.seller_email);
        if (sellerUser) {
          sellerId = sellerUser.id;
          sellerName = sellerUser.full_name;
        }
      } catch (lookupErr) { console.warn("Seller lookup failed:", lookupErr); }

      const trade = await Trade.create({
        buyer_id: user.id, buyer_email: user.email, buyer_name: user.full_name,
        seller_id: sellerId, seller_email: form.seller_email, seller_name: sellerName,
        item_name: form.item_name,
        item_description: form.item_description, amount, calculated_fee: fee,
        fee_payer: form.fee_payer, status: "Pending_Acceptance", reference: ref,
        delivery_deadline: form.delivery_deadline || null,
      });
      setCreatedTrade(trade);
      setStep(2);
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  const fmt = (v) => "₦" + (Number(v) || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 });

  if (step === 2 && createdTrade) {
    return (
      <AppLayout user={user}>
        <div className="max-w-lg mx-auto px-4 py-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-info/10">
              <Mail className="w-7 h-7 text-info" />
            </div>
            <h1 className="text-2xl font-black text-foreground">Trade Sent to Seller</h1>
            <p className="text-muted text-sm mt-2">We've notified {createdTrade.seller_email} — you'll be notified as soon as they respond.</p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 mb-6 space-y-4">
            <div className="flex items-center gap-2 text-warning text-sm font-semibold">
              <Clock className="w-4 h-4" /> Awaiting Seller Acceptance
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted">Item</span><span className="font-semibold text-foreground">{createdTrade.item_name}</span></div>
              <div className="flex justify-between"><span className="text-muted">Amount</span><span className="font-semibold text-foreground">{fmt(amount)}</span></div>
              <div className="flex justify-between"><span className="text-muted">Reference</span><span className="font-mono text-foreground">{createdTrade.reference}</span></div>
            </div>
            <div className="flex items-start gap-2 text-xs text-muted pt-2 border-t border-border">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>Once the seller accepts, you'll get a bank transfer account to fund the escrow. If they reject or request changes, we'll let you know here and by email.</span>
            </div>
          </div>

          <button onClick={() => navigate(`/trades/${createdTrade.id}`)} className="w-full py-3 rounded-full text-primary-foreground font-semibold text-sm bg-primary hover:bg-primary-hover transition-colors">
            View Trade Status
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={user}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-foreground">Create Escrow Trade</h1>
          <p className="text-muted text-sm mt-1">Escrow fee is {(feeRate * 100).toFixed(1)}% of the trade amount. The seller must accept before payment begins.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
            <h2 className="font-bold text-foreground">Item Details</h2>
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1.5">Item Name *</label>
              <input required value={form.item_name} onChange={(e) => setForm({ ...form, item_name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary" placeholder="e.g. iPhone 14 Pro Max" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1.5">Description</label>
              <textarea value={form.item_description} onChange={(e) => setForm({ ...form, item_description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary resize-none" rows={3} placeholder="Describe the item and agreed terms..." />
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
            <h2 className="font-bold text-foreground">Trade Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-1.5">Amount (₦) *</label>
                <input required type="number" min="1000" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary" placeholder="50000" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-1.5">Delivery Deadline</label>
                <input type="date" value={form.delivery_deadline} onChange={(e) => setForm({ ...form, delivery_deadline: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1.5">Seller Email *</label>
              <input required value={form.seller_email} onChange={(e) => setForm({ ...form, seller_email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary" placeholder="seller@email.com" />
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-bold text-foreground mb-3">Who Pays the Escrow Fee?</h2>
            <div className="flex rounded-xl border border-border overflow-hidden mb-4">
              {["BUYER", "SELLER", "SPLIT_50_50"].map((opt) => (
                <button key={opt} type="button" onClick={() => setForm({ ...form, fee_payer: opt })}
                  className={`flex-1 py-3 text-sm font-semibold transition-all ${form.fee_payer === opt ? "text-primary-foreground bg-primary" : "text-muted"}`}>
                  {opt === "SPLIT_50_50" ? "Split 50/50" : opt === "BUYER" ? "Buyer Pays" : "Seller Pays"}
                </button>
              ))}
            </div>
            {amount > 0 && (
              <div className="bg-primary/10 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-text-secondary">Platform Fee ({(feeRate * 100).toFixed(1)}%)</span><span className="font-semibold text-foreground">{fmt(fee)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-text-secondary">Buyer Transfers (once accepted)</span><span className="font-semibold text-foreground">{fmt(buyerPays)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-text-secondary">Seller Receives</span><span className="font-bold text-primary">{fmt(sellerReceives)}</span></div>
              </div>
            )}
          </div>
          <button type="submit" disabled={loading} className="w-full py-4 rounded-full text-primary-foreground font-bold text-sm disabled:opacity-60 bg-btn-gradient hover:opacity-90 transition-opacity">
            {loading ? "Sending to Seller..." : "Send Trade Request to Seller →"}
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
