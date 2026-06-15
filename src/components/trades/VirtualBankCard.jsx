import React, { useState } from "react";
import { Copy, Check, Info } from "lucide-react";

export default function VirtualBankCard({ trade }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(trade.virtual_account_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fee = trade.calculated_fee || 0;
  const buyerPays =
    trade.fee_payer === "BUYER" ? trade.amount + fee :
    trade.fee_payer === "SPLIT_50_50" ? trade.amount + fee / 2 : trade.amount;

  const fmt = (v) => "₦" + (v || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 });
  const expires = trade.virtual_account_expires_at ? new Date(trade.virtual_account_expires_at) : null;

  return (
    <div className="mb-6">
      <div
        className="rounded-2xl text-white p-6 shadow-xl"
        style={{ background: "linear-gradient(135deg, #0D1F3C 0%, #163560 100%)" }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-white/50 text-xs uppercase tracking-widest">Awaiting Transfer</div>
            <div className="text-white font-bold text-sm mt-0.5">{trade.reference}</div>
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: "#00A651" }}>
            PENDING
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-4 mb-3">
          <div className="text-white/50 text-xs mb-1">Bank Name</div>
          <div className="text-white font-bold">{trade.virtual_bank_name}</div>
          <div className="text-white/40 text-xs mt-0.5">TrustGuard / {trade.reference}</div>
        </div>

        <div className="bg-white/10 rounded-xl p-4 mb-3">
          <div className="text-white/50 text-xs mb-1">Account Number</div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-black tracking-widest">{trade.virtual_account_number}</div>
            <button
              onClick={copy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/30 hover:bg-white/10 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-4 mb-3">
          <div className="text-white/50 text-xs mb-1">Transfer Exact Amount</div>
          <div className="text-3xl font-black" style={{ color: "#00A651" }}>{fmt(buyerPays)}</div>
          <div className="text-white/40 text-xs mt-1">
            Includes {fmt(trade.fee_payer === "BUYER" ? fee : trade.fee_payer === "SPLIT_50_50" ? fee / 2 : 0)} escrow fee
          </div>
        </div>

        {expires && (
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <Info className="w-3 h-3" />
            Account expires: {expires.toLocaleString("en-NG")}
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-3">
        <p className="text-amber-800 text-xs font-semibold mb-1">⚠ Transfer the exact amount shown</p>
        <p className="text-amber-700 text-xs">
          Payment is confirmed automatically within seconds via our bank webhook — even if your phone goes offline after the transfer.
        </p>
      </div>
    </div>
  );
}