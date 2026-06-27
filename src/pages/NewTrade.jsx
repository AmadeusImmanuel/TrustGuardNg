import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, Trade, Transaction, userLookup, platformSettings } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import { Info, CreditCard, Building2 } from "lucide-react";
// FEE_RATE now fetched live from platformSettings
const BANKS = ["Sterling Bank", "Wema Bank", "Moniepoint", "GTBank", "First Bank", "Zenith Bank", "Access Bank", "UBA"];
function generateRef() { return "TG-" + Math.random().toString(36).substring(2, 8).toUpperCase(); }
function generateAccount() { return "2" + Math.floor(Math.random() * 900000000 + 100000000); }
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
      const ref = generateRef();
      const bank = BANKS[Math.floor(Math.random() * BANKS.length)];
      const acct = generateAccount();
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
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
        fee_payer: form.fee_payer, status: "Awaiting_Payment", reference: ref,
        virtual_bank_name: bank, virtual_account_number: acct,
        virtual_account_expires_at: expires, delivery_deadline: form.delivery_deadline || null,
      });
      await Transaction.create({
        trade_id: trade.id, trade_reference: ref, user_id: user.id,
        user_name: user.full_name, amount: buyerPays, fee_collected: fee,
        type: "Escrow_Inflow", direction: "debit",
        description: `Escrow created for: ${form.item_name}`, status: "pending",
      });
      setCreatedTrade(trade);
      setStep(2);
    } catch (err) { alert(err.message); }
    setLoading(false);
  };
  const fmt = (v) => "₦" + (Number(v) || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 });
  if (step === 2 && createdTrade) {
    const expires = new Date(createdTrade.virtual_account_expires_at);
    return (
      <AppLayout user={user}>
        <div className="max-w-lg mx-auto px-4 py-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#f0fff7" }}>
              <span className="text-3xl">✅</span>
            </div>
            <h1 className="text-2xl font-black text-[#0D1F3C]">Trade Created!</h1>
            <p className="text-gray-500 text-sm mt-2">Fund via bank transfer to activate escrow.</p>
          </div>
          <div className="rounded-2xl text-white p-6 mb-6 shadow-xl" style={{ background: "linear-gradient(135deg, #0D1F3C 0%, #163560 100%)" }}>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-4 h-4 text-white/50" />
              <span className="text-white/50 text-xs uppercase tracking-widest">Bank Transfer Details</span>
            </div>
            <div className="bg-white/10 rounded-xl p-4 mb-4">
              <div className="text-white/50 text-xs mb-1">Bank Name</div>
              <div className="text-white font-bold">{createdTrade.virtual_bank_name}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 mb-4">
              <div className="text-white/50 text-xs mb-1">Account Number</div>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-black tracking-widest text-white">{createdTrade.virtual_account_number}</div>
                <button onClick={() => navigator.clipboard.writeText(createdTrade.virtual_account_number)} className="px-3 py-1 rounded-lg text-xs font-semibold text-white border border-white/30">Copy</button>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-white/50 text-xs mb-1">Transfer Exact Amount</div>
              <div className="text-3xl font-black" style={{ color: "#00A651" }}>{fmt(buyerPays)}</div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-white/40 text-xs">
              <Info className="w-3 h-3" /> Account expires: {expires.toLocaleString("en-NG")}
            </div>
          </div>
          <button onClick={() => navigate(`/trades/${createdTrade.id}`)} className="w-full py-3 rounded-full text-white font-semibold text-sm" style={{ background: "#00A651" }}>
            View Trade Details
          </button>
        </div>
      </AppLayout>
    );
  }
  return (
    <AppLayout user={user}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-[#0D1F3C]">Create Escrow Trade</h1>
          <p className="text-gray-500 text-sm mt-1">Escrow fee is {(feeRate * 100).toFixed(1)}% of the trade amount.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="font-bold text-[#0D1F3C]">Item Details</h2>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Item Name *</label>
              <input required value={form.item_name} onChange={(e) => setForm({ ...form, item_name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500" placeholder="e.g. iPhone 14 Pro Max" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
              <textarea value={form.item_description} onChange={(e) => setForm({ ...form, item_description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500 resize-none" rows={3} placeholder="Describe the item and agreed terms..." />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="font-bold text-[#0D1F3C]">Trade Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Amount (₦) *</label>
                <input required type="number" min="1000" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500" placeholder="50000" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Delivery Deadline</label>
                <input type="date" value={form.delivery_deadline} onChange={(e) => setForm({ ...form, delivery_deadline: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Seller Email *</label>
              <input required value={form.seller_email} onChange={(e) => setForm({ ...form, seller_email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500" placeholder="seller@email.com" />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-[#0D1F3C] mb-3">Who Pays the Escrow Fee?</h2>
            <div className="flex rounded-xl border border-gray-200 overflow-hidden mb-4">
              {["BUYER", "SELLER", "SPLIT_50_50"].map((opt) => (
                <button key={opt} type="button" onClick={() => setForm({ ...form, fee_payer: opt })} className={`flex-1 py-3 text-sm font-semibold transition-all ${form.fee_payer === opt ? "text-white" : "text-gray-500"}`} style={form.fee_payer === opt ? { background: "#00A651" } : {}}>
                  {opt === "SPLIT_50_50" ? "Split 50/50" : opt === "BUYER" ? "Buyer Pays" : "Seller Pays"}
                </button>
              ))}
            </div>
            {amount > 0 && (
              <div className="bg-[#f0fff7] rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-600">Platform Fee ({(feeRate * 100).toFixed(1)}%)</span><span className="font-semibold">{fmt(fee)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Buyer Transfers</span><span className="font-semibold">{fmt(buyerPays)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Seller Receives</span><span className="font-bold" style={{ color: "#00A651" }}>{fmt(sellerReceives)}</span></div>
              </div>
            )}
          </div>
          <button type="submit" disabled={loading} className="w-full py-4 rounded-full text-white font-bold text-sm disabled:opacity-60" style={{ background: "#00A651" }}>
            {loading ? "Creating Trade..." : "Create Trade & Generate Payment Account →"}
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
