import React, { useState } from "react";
import QRCode from "react-qr-code";
import { QrCode, Download, Copy, CheckCircle } from "lucide-react";

export default function TradeQRCode({ trade }) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const baseUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5173";
  const tradeUrl = `${baseUrl}/trades/${trade.id}`;

  const qrData = JSON.stringify({
    ref: trade.reference,
    item: trade.item_name,
    amount: trade.amount,
    status: trade.status,
    url: tradeUrl,
  });

  const copyLink = () => {
    navigator.clipboard.writeText(tradeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const svg = document.getElementById(`qr-${trade.id}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 300, 300);
      ctx.drawImage(img, 0, 0, 300, 300);
      URL.revokeObjectURL(url);
      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `TrustGuard-QR-${trade.reference}.png`;
      link.href = pngUrl;
      link.click();
    };
    img.src = url;
  };

  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{ background: "#111827", borderColor: "rgba(255,255,255,0.06)" }}>
      <button
        onClick={() => setShowQR(!showQR)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/5 transition-colors">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(22,196,127,0.15)" }}>
          <QrCode className="w-4 h-4" style={{ color: "#16C47F" }} />
        </div>
        <div className="flex-1 text-left">
          <div className="text-sm font-semibold text-white">Trade QR Code</div>
          <div className="text-xs text-slate-500 mt-0.5">Scan to access trade details instantly</div>
        </div>
        <span className="text-xs text-slate-500">{showQR ? "Hide" : "Show"}</span>
      </button>

      {showQR && (
        <div className="px-5 pb-5 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex flex-col items-center gap-4 pt-4">
            {/* QR Code */}
            <div className="p-4 rounded-2xl bg-white shadow-lg">
              <QRCode
                id={`qr-${trade.id}`}
                value={qrData}
                size={180}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                viewBox="0 0 256 256"
              />
            </div>

            {/* Trade info under QR */}
            <div className="text-center">
              <div className="text-white font-bold text-sm">{trade.item_name}</div>
              <div className="text-slate-500 text-xs mt-0.5 font-mono">{trade.reference}</div>
              <div className="text-green-400 font-bold text-sm mt-1">
                ₦{(Number(trade.amount) || 0).toLocaleString("en-NG")}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 w-full">
              <button onClick={copyLink}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all border"
                style={{ borderColor: "rgba(255,255,255,0.1)", color: copied ? "#16C47F" : "#94A3B8", background: "rgba(255,255,255,0.04)" }}>
                {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy Link"}
              </button>
              <button onClick={downloadQR}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all"
                style={{ background: "rgba(22,196,127,0.15)", color: "#16C47F" }}>
                <Download className="w-3.5 h-3.5" />
                Download QR
              </button>
            </div>

            {/* Instructions */}
            <div className="w-full p-3 rounded-xl text-xs text-slate-500 text-center"
              style={{ background: "rgba(255,255,255,0.03)" }}>
              Share this QR code with your trade partner for instant verification
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
