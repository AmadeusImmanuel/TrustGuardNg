import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Search, CheckCircle, Clock, Package, AlertTriangle, XCircle, ChevronLeft } from "lucide-react";
import ShareButton from "@/components/ShareButton";

const STATUS_CONFIG = {
  Awaiting_Payment: { label: "Waiting for Payment", icon: Clock, color: "#d97706", step: 1 },
  Funded: { label: "Payment Received", icon: CheckCircle, color: "#2563eb", step: 2 },
  Shipped: { label: "Item Shipped", icon: Package, color: "#7c3aed", step: 3 },
  Confirmed: { label: "Delivery Confirmed", icon: CheckCircle, color: "#059669", step: 4 },
  Disputed: { label: "Under Dispute", icon: AlertTriangle, color: "#dc2626", step: 3 },
  Resolved: { label: "Resolved", icon: CheckCircle, color: "#059669", step: 4 },
};
const STEPS = ["Payment", "Funded", "Shipped", "Confirmed"];

// Public, unauthenticated tracking page — hits GET /api/trades/track/:reference,
// which has no `authenticate` middleware, so this is safe to link out to
// anyone (buyer, seller, or a curious third party with just the reference).
export default function TrackTransaction() {
  const { reference: refParam } = useParams();
  const navigate = useNavigate();
  const [ref, setRef] = useState(refParam || "");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const track = async (refToUse) => {
    const r = (refToUse ?? ref).trim();
    if (!r) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000/api"}/trades/track/${r}`);
      if (!res.ok) throw new Error("Transaction not found");
      const data = await res.json();
      setResult(data);
      if (r !== refParam) navigate(`/track/${r}`, { replace: true });
    } catch (err) {
      setError("Transaction not found. Please check the reference and try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (refParam) track(refParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refParam]);

  const statusInfo = result ? (STATUS_CONFIG[result.status] || STATUS_CONFIG.Awaiting_Payment) : null;
  const shareUrl = result ? `${window.location.origin}/track/${result.reference}` : "";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#0D1F3C] mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to TrustGuard
        </Link>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-[#0D1F3C] mb-2">Track a Transaction</h1>
          <p className="text-gray-500 text-sm">Enter a TrustGuard reference number to see the live status — no login required.</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); track(); }} className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input value={ref} onChange={(e) => setRef(e.target.value.toUpperCase())}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 text-sm font-mono focus:outline-none focus:border-green-500 bg-white shadow-sm"
              placeholder="e.g. TG-ABC123" />
          </div>
          <button type="submit" disabled={loading}
            className="px-6 py-4 rounded-2xl text-white font-semibold text-sm disabled:opacity-60 shadow-lg hover:opacity-90 transition-all"
            style={{ background: "#00A651" }}>
            {loading ? "..." : "Track"}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-700 text-sm">
            <XCircle className="w-5 h-5 shrink-0" /> {error}
          </div>
        )}

        {result && statusInfo && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm text-gray-400">{result.reference}</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: statusInfo.color + "15", color: statusInfo.color }}>
                  {statusInfo.label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-xl text-[#0D1F3C]">{result.item_name}</h3>
                  <p className="text-green-600 font-bold text-lg mt-1">₦{(Number(result.amount) || 0).toLocaleString("en-NG")}</p>
                </div>
                <ShareButton url={shareUrl} title="TrustGuard Transaction" text={`Track this TrustGuard escrow trade: ${result.item_name}`} />
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                {STEPS.map((step, i) => {
                  const done = statusInfo.step > i + 1;
                  const active = statusInfo.step === i + 1;
                  return (
                    <React.Fragment key={step}>
                      <div className="flex flex-col items-center gap-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${done || active ? "text-white" : "bg-gray-100 text-gray-400"}`}
                          style={done || active ? { background: done ? "#00A651" : statusInfo.color } : {}}>
                          {done ? "✓" : i + 1}
                        </div>
                        <span className={`text-xs font-medium ${active ? "text-[#0D1F3C]" : "text-gray-400"}`}>{step}</span>
                      </div>
                      {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${done ? "bg-green-400" : "bg-gray-200"}`} />}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
            <div className="px-6 pb-6 grid grid-cols-2 gap-4 text-sm">
              <div><div className="text-gray-400 text-xs mb-1">Created</div><div className="font-semibold text-[#0D1F3C]">{new Date(result.created_date).toLocaleDateString("en-NG")}</div></div>
              {result.shipped_at && <div><div className="text-gray-400 text-xs mb-1">Shipped</div><div className="font-semibold text-[#0D1F3C]">{new Date(result.shipped_at).toLocaleDateString("en-NG")}</div></div>}
              {result.confirmed_at && <div><div className="text-gray-400 text-xs mb-1">Confirmed</div><div className="font-semibold text-[#0D1F3C]">{new Date(result.confirmed_at).toLocaleDateString("en-NG")}</div></div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
