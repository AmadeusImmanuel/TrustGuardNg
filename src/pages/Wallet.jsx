import React, { useEffect, useState } from "react";
import { auth, Transaction, Payout, User } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import KYCSection from "@/components/wallet/KYCSection";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
export default function Wallet() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [wForm, setWForm] = useState({ amount: "", bank: "", account: "" });
  const [wLoading, setWLoading] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const u = await auth.me();
        setUser(u);
        const txns = await Transaction.list({ user_id: u.id });
        setTransactions(txns);
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, []);
  const balance = user?.wallet_balance || 0;
  const fmt = (v) => "₦" + (Number(v) || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 });
  const handleWithdraw = async (e) => {
    e.preventDefault();
    const amount = parseFloat(wForm.amount);
    if (amount > balance) return alert("Insufficient balance");
    if (amount > 50000 && user.kyc_status !== "verified") {
      return alert("KYC verification is required to withdraw above ₦50,000. Please complete identity verification first.");
    }
    setWLoading(true);
    try {
      await Payout.create({ user_id: user.id, amount, currency: "NGN", status: "pending", bank_account: { bank: wForm.bank, account: wForm.account } });
      await Transaction.create({ user_id: user.id, amount, type: "Withdrawal", direction: "debit", description: `Withdrawal to ${wForm.bank}`, status: "pending" });
      await User.update(user.id, { wallet_balance: balance - amount });
      setUser({ ...user, wallet_balance: balance - amount });
      setShowWithdraw(false);
      setWForm({ amount: "", bank: "", account: "" });
    } catch (err) { alert(err.message); }
    setWLoading(false);
  };
  return (
    <AppLayout user={user}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-[#0D1F3C] mb-6">Wallet</h1>
        <div className="rounded-2xl text-white p-6 mb-6 shadow-xl" style={{ background: "linear-gradient(135deg, #0D1F3C 0%, #163560 100%)" }}>
          <div className="text-white/50 text-xs uppercase tracking-widest mb-2">Available Balance</div>
          <div className="text-4xl font-black mb-4">{fmt(balance)}</div>
          <button onClick={() => setShowWithdraw(true)} className="px-5 py-2.5 rounded-full text-white font-semibold text-sm border border-white/30 hover:bg-white/10">
            Withdraw Funds
          </button>
        </div>
        <div className="mb-6"><KYCSection user={user} onUpdate={setUser} /></div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-[#0D1F3C] mb-4">Transaction History</h2>
          {loading ? (
            <div className="flex justify-center py-8"><div className="w-6 h-6 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" /></div>
          ) : transactions.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No transactions yet.</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {transactions.map((t) => (
                <div key={t.id} className="flex items-center gap-3 py-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${t.direction === "credit" ? "bg-green-50" : "bg-red-50"}`}>
                    {t.direction === "credit" ? <ArrowDownLeft className="w-4 h-4 text-green-600" /> : <ArrowUpRight className="w-4 h-4 text-red-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[#0D1F3C] truncate">{t.description || t.type}</div>
                    <div className="text-xs text-gray-400">{new Date(t.created_date).toLocaleDateString("en-NG")}</div>
                  </div>
                  <div className={`font-bold text-sm ${t.direction === "credit" ? "text-green-600" : "text-red-500"}`}>
                    {t.direction === "credit" ? "+" : "-"}{fmt(t.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {showWithdraw && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="font-bold text-[#0D1F3C] text-lg mb-4">Withdraw Funds</h2>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Amount (₦)</label>
                <input required type="number" min="1000" max={balance} value={wForm.amount} onChange={(e) => setWForm({ ...wForm, amount: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" placeholder="5000" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bank Name</label>
                <input required value={wForm.bank} onChange={(e) => setWForm({ ...wForm, bank: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" placeholder="GTBank" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Account Number</label>
                <input required value={wForm.account} onChange={(e) => setWForm({ ...wForm, account: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" placeholder="0123456789" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowWithdraw(false)} className="flex-1 py-3 rounded-full border border-gray-200 text-sm font-semibold text-gray-600">Cancel</button>
                <button type="submit" disabled={wLoading} className="flex-1 py-3 rounded-full text-white text-sm font-semibold disabled:opacity-60" style={{ background: "#00A651" }}>{wLoading ? "Processing..." : "Withdraw"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
