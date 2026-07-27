import React, { useEffect, useRef, useState } from "react";

const stats = [
  { value: "₦2.4B+", label: "Escrow Volume Protected", icon: "💰" },
  { value: "48,000+", label: "Trades Completed", icon: "✅" },
  { value: "99.8%", label: "Dispute Resolution Rate", icon: "⚖️" },
  { value: "12,000+", label: "Verified Users", icon: "👥" },
  { value: "< 5s", label: "Payment Confirmation", icon: "⚡" },
  { value: "0", label: "Fraud Cases Unresolved", icon: "🛡️" },
];

export default function TrustStats() {
  return (
    <section className="py-24 text-white relative overflow-hidden" style={{ background: "#0D1F3C" }}>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: "#00A651" }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: "#00A651" }} />
      </div>
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black mb-3">Trusted by Nigerian traders every day</h2>
          <p className="text-white/60">Real numbers. Real protection. Real results.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all hover:-translate-y-1">
              <div className="text-3xl mb-3">{s.icon}</div>
              <div className="text-4xl md:text-5xl font-black mb-2" style={{ color: "#00A651" }}>{s.value}</div>
              <div className="text-white/60 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
