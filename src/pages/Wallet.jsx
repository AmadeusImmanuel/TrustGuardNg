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
        <h1 className="text-2xl font-black text-foreground mb-6">Wallet</h1>
        <div className="rounded-2xl text-primary-foreground p-6 mb-6 shadow-elevated bg-brand-gradient">
          <div className="text-white/50 text-xs uppercase tracking-widest mb-2">Available Balance</div>
          <div className="text-4xl font-black mb-4">{fmt(balance)}</div>
          <button onClick={() => setShowWithdraw(true)} className="px-5 py-2.5 rounded-full text-white font-semibold text-sm border border-white/30 hover:bg-white/10 transition-colors">
            Withdraw Funds
          </button>
        </div>
        <div className="mb-6"><KYCSection user={user} onUpdate={setUser} /></div>
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="font-bold text-foreground mb-4">Transaction History</h2>
          {loading ? (
            <div className="flex justify-center py-8"><div className="w-6 h-6 border-4 border-border border-t-primary rounded-full animate-spin" /></div>
          ) : transactions.length === 0 ? (
            <p className="text-muted text-sm text-center py-8">No transactions yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {transactions.map((t) => (
                <div key={t.id} className="flex items-center gap-3 py-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${t.direction === "credit" ? "bg-success/10" : "bg-danger/10"}`}>
                    {t.direction === "credit" ? <ArrowDownLeft className="w-4 h-4 text-success" /> : <ArrowUpRight className="w-4 h-4 text-danger" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground truncate">{t.description || t.type}</div>
                    <div className="text-xs text-muted">{new Date(t.created_date).toLocaleDateString("en-NG")}</div>
                  </div>
                  <div className={`font-bold text-sm ${t.direction === "credit" ? "text-success" : "text-danger"}`}>
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
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md">
            <h2 className="font-bold text-foreground text-lg mb-4">Withdraw Funds</h2>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-1.5">Amount (₦)</label>
                <input required type="number" min="1000" max={balance} value={wForm.amount} onChange={(e) => setWForm({ ...wForm, amount: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary" placeholder="5000" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-1.5">Bank Name</label>
                <input required value={wForm.bank} onChange={(e) => setWForm({ ...wForm, bank: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary" placeholder="GTBank" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-1.5">Account Number</label>
                <input required value={wForm.account} onChange={(e) => setWForm({ ...wForm, account: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary" placeholder="0123456789" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowWithdraw(false)} className="flex-1 py-3 rounded-full border border-border text-sm font-semibold text-text-secondary">Cancel</button>
                <button type="submit" disabled={wLoading} className="flex-1 py-3 rounded-full text-primary-foreground text-sm font-semibold disabled:opacity-60 bg-primary hover:bg-primary-hover transition-colors">{wLoading ? "Processing..." : "Withdraw"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
