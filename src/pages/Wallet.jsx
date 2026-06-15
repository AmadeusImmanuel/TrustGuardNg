import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import KYCSection from "@/components/wallet/KYCSection";
import { Wallet as WalletIcon, TrendingUp, TrendingDown, ArrowDownCircle } from "lucide-react";

export default function Wallet() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawForm, setWithdrawForm] = useState({ bank_name: "", account_number: "", account_name: "", amount: "" });
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const u = await base44.auth.me();
      setUser(u);
      const [txns, pays] = await Promise.all([
        base44.entities.Transaction.filter({ user_id: u.id }, "-created_date", 20),
        base44.entities.Payout.filter({ user_id: u.id }, "-created_date", 10),
      ]);
      setTransactions(txns);
      setPayouts(pays);
      setLoading(false);
    })();
  }, []);

  const refreshUser = async () => {
    const u = await base44.auth.me();
    setUser(u);
  };

  const fmt = (v) => "₦" + (v || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 });

  const submitWithdraw = async (e) => {
    e.preventDefault();
    if (user?.kyc_status !== "Verified") {
      alert("You must verify your identity before withdrawing.");
      return;
    }
    const amount = parseFloat(withdrawForm.amount);
    if (amount > (user?.wallet_balance || 0)) {
      alert("Insufficient wallet balance.");
      return;
    }
    setWithdrawLoading(true);
    await base44.entities.Payout.create({
      user_id: user.id,
      user_name: user.full_name,
      user_email: user.email,
      bank_name: withdrawForm.bank_name,
      account_number: withdrawForm.account_number,
      account_name: withdrawForm.account_name,
      amount: amount,
      status: "Initiated",
    });
    await base44.entities.Transaction.create({
      user_id: user.id,
      user_name: user.full_name,
      amount: amount,
      type: "Payout_Withdrawal",
      direction: "debit",
      description: `Withdrawal to ${withdrawForm.bank_name} - ${withdrawForm.account_number}`,
      status: "pending",
    });
    await base44.auth.updateMe({ wallet_balance: (user.wallet_balance || 0) - amount });
    await refreshUser();
    setShowWithdraw(false);
    setWithdrawForm({ bank_name: "", account_number: "", account_name: "", amount: "" });
    setWithdrawLoading(false);
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

  return (
    <AppLayout user={user}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-[#0D1F3C] mb-6">Wallet</h1>

        {/* Balance card */}
        <div className="rounded-2xl text-white p-6 mb-6 shadow-xl" style={{ background: "linear-gradient(135deg, #0D1F3C 0%, #163560 100%)" }}>
          <div className="text-white/50 text-xs uppercase tracking-widest mb-1">Available Balance</div>
          <div className="text-4xl font-black mb-6" style={{ color: "#00A651" }}>{fmt(user?.wallet_balance)}</div>
          <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-4">
            <div>
              <div className="text-white/40 text-xs mb-1">Pending</div>
              <div className="text-white font-bold text-sm">{fmt(user?.pending_escrow)}</div>
            </div>
            <div>
              <div className="text-white/40 text-xs mb-1">Total Received</div>
              <div className="text-white font-bold text-sm">{fmt(user?.total_received)}</div>
            </div>
            <div>
              <div className="text-white/40 text-xs mb-1">Total Paid</div>
              <div className="text-white font-bold text-sm">{fmt(user?.total_paid)}</div>
            </div>
          </div>
        </div>

        {/* Withdraw button */}
        <button
          onClick={() => setShowWithdraw(true)}
          disabled={user?.kyc_status !== "Verified"}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-sm mb-6 disabled:opacity-40 transition-all hover:opacity-90"
          style={{ background: "#00A651", color: "white" }}
        >
          <ArrowDownCircle className="w-5 h-5" />
          Withdraw to Bank Account
          {user?.kyc_status !== "Verified" && <span className="text-xs opacity-70">(KYC required)</span>}
        </button>

        {/* KYC Section */}
        <KYCSection user={user} onUpdate={refreshUser} />

        {/* Transaction History */}
        <div className="bg-white rounded-2xl border border-gray-100 mt-6">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="font-bold text-[#0D1F3C]">Transaction History</h2>
          </div>
          {transactions.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">No transactions yet</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {transactions.map((t) => (
                <div key={t.id} className="flex items-center gap-4 px-6 py-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${t.direction === "credit" ? "bg-green-50" : "bg-red-50"}`}>
                    {t.direction === "credit"
                      ? <TrendingUp className="w-5 h-5 text-green-500" />
                      : <TrendingDown className="w-5 h-5 text-red-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[#0D1F3C] truncate">{t.description || t.type?.replace(/_/g, " ")}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{new Date(t.created_date).toLocaleDateString("en-NG")}</div>
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

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="font-bold text-[#0D1F3C] text-lg mb-4">Withdraw Funds</h2>
            <form onSubmit={submitWithdraw} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bank Name *</label>
                <input required value={withdrawForm.bank_name} onChange={(e) => setWithdrawForm({ ...withdrawForm, bank_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500"
                  placeholder="e.g. GTBank" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Account Number *</label>
                <input required value={withdrawForm.account_number} onChange={(e) => setWithdrawForm({ ...withdrawForm, account_number: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500"
                  placeholder="0123456789" maxLength={10} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Account Name *</label>
                <input required value={withdrawForm.account_name} onChange={(e) => setWithdrawForm({ ...withdrawForm, account_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500"
                  placeholder="Full name as on account" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Amount (₦) *</label>
                <input required type="number" min="500" max={user?.wallet_balance || 0} value={withdrawForm.amount} onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500"
                  placeholder="Minimum ₦500" />
                <p className="text-xs text-gray-400 mt-1">Available: {fmt(user?.wallet_balance)}</p>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowWithdraw(false)} className="flex-1 py-3 rounded-full border border-gray-200 text-sm font-semibold text-gray-600">Cancel</button>
                <button type="submit" disabled={withdrawLoading} className="flex-1 py-3 rounded-full text-white text-sm font-semibold disabled:opacity-60" style={{ background: "#00A651" }}>
                  {withdrawLoading ? "Processing..." : "Withdraw"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}