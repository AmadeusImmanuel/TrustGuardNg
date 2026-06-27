import React, { useState, useEffect } from "react";
import { Calculator } from "lucide-react";
import { platformSettings } from "@/api/base44Client";

export default function FeeCalculator() {
  const [amount, setAmount] = useState("");
  const [feePayer, setFeePayer] = useState("BUYER");
  const [feeRate, setFeeRate] = useState(0.015);

  useEffect(() => { platformSettings.getFeeRate().then((r) => setFeeRate(r.fee_rate)).catch(() => {}); }, []);

  const numAmount = parseFloat(amount.replace(/,/g, "")) || 0;
  const fee = numAmount * feeRate;

  let buyerPays = 0;
  let sellerReceives = 0;
  let feeNote = "";

  if (feePayer === "BUYER") {
    buyerPays = numAmount + fee;
    sellerReceives = numAmount;
    feeNote = "Buyer covers the fee on top of the trade amount.";
  } else if (feePayer === "SELLER") {
    buyerPays = numAmount;
    sellerReceives = numAmount - fee;
    feeNote = "Fee deducted from seller's payout.";
  } else {
    buyerPays = numAmount + fee / 2;
    sellerReceives = numAmount - fee / 2;
    feeNote = "Fee split equally between buyer and seller.";
  }

  const fmt = (v) =>
    (v && !isNaN(v)) ? "₦" + v.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "₦0.00";

  return (
    <section id="calculator" className="py-24 bg-white">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: "#f0fff7" }}>
            <Calculator className="w-6 h-6" style={{ color: "#00A651" }} />
          </div>
          <h2 className="text-4xl font-black text-[#0D1F3C] mb-3">Fee Calculator</h2>
          <p className="text-gray-500">See exactly what you pay — {(feeRate * 100).toFixed(1)}% flat, always transparent.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8">
          {/* Amount input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#0D1F3C] mb-2">Trade Amount (₦)</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="e.g. 50000"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-lg font-semibold text-[#0D1F3C] focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>

          {/* Fee payer toggle */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-[#0D1F3C] mb-2">Who pays the fee?</label>
            <div className="flex rounded-xl border border-gray-200 overflow-hidden">
              {["BUYER", "SELLER", "SPLIT_50_50"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFeePayer(opt)}
                  className={`flex-1 py-2.5 text-sm font-semibold transition-all ${
                    feePayer === opt ? "text-white" : "text-gray-500 hover:bg-gray-50"
                  }`}
                  style={feePayer === opt ? { background: "#00A651" } : {}}
                >
                  {opt === "SPLIT_50_50" ? "Split 50/50" : opt === "BUYER" ? "Buyer" : "Seller"}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="space-y-3">
            <div className="flex justify-between items-center py-3 border-t border-gray-100">
              <span className="text-gray-500 text-sm">Platform Fee ({(feeRate * 100).toFixed(1)}%)</span>
              <span className="font-bold text-[#0D1F3C]">{fmt(fee)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-t border-gray-100">
              <span className="text-gray-500 text-sm">Buyer Transfers</span>
              <span className="font-bold text-[#0D1F3C]">{fmt(buyerPays)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-t border-b border-gray-100">
              <span className="text-gray-500 text-sm">Seller Receives</span>
              <span className="font-bold text-xl" style={{ color: "#00A651" }}>{fmt(sellerReceives)}</span>
            </div>
            <p className="text-xs text-gray-400 text-center pt-2">{feeNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}