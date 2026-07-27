import React, { useState } from "react";
import { PaystackAPI } from "@/api/base44Client";
import { CreditCard } from "lucide-react";

export default function PaystackButton({ trade, user, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fee = Number(trade.calculated_fee) || 0;
  const amount = Number(trade.amount) || 0;
  const feePayer = trade.fee_payer || "BUYER";
  const buyerPays = feePayer === "BUYER" ? amount + fee : feePayer === "SPLIT_50_50" ? amount + fee / 2 : amount;

  const pay = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await PaystackAPI.initialize({
        trade_id: trade.id,
        email: user.email,
        amount: buyerPays,
      });

      if (!data.authorization_url) throw new Error("Could not initialize payment");

      // Redirect to Paystack checkout
      window.location.href = data.authorization_url;
    } catch (err) {
      setError(err.message || "Payment initialization failed");
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border-2 border-green-200 bg-white p-5 shadow-sm mb-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#f0fff7" }}>
          <CreditCard className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="font-bold text-[#0D1F3C]">Pay with Paystack</h3>
          <p className="text-gray-500 text-xs">Card, Bank Transfer, USSD & more</p>
        </div>
        <div className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: "#00A651" }}>
          RECOMMENDED
        </div>
      </div>
      <div className="bg-gray-50 rounded-xl p-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">You'll pay</span>
          <span className="font-bold text-[#0D1F3C]">₦{buyerPays.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
      {error && <div className="text-red-500 text-xs mb-3 px-3 py-2 bg-red-50 rounded-xl">{error}</div>}
      <button onClick={pay} disabled={loading}
        className="w-full py-3 rounded-xl text-white font-bold text-sm disabled:opacity-60 flex items-center justify-center gap-2"
        style={{ background: "#00A651" }}>
        {loading ? (
          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Redirecting to Paystack...</>
        ) : (
          <><CreditCard className="w-4 h-4" /> Pay ₦{buyerPays.toLocaleString("en-NG")} Now</>
        )}
      </button>
      <p className="text-center text-xs text-gray-400 mt-2">Secured by Paystack · 256-bit SSL</p>
    </div>
  );
}
