import React from "react";

const stats = [
  { value: "₦2.4B+", label: "Escrow Volume Processed" },
  { value: "48,000+", label: "Trades Completed" },
  { value: "99.8%", label: "Dispute Resolution Rate" },
  { value: "< 5s", label: "Webhook Payment Confirmation" },
];

export default function TrustStats() {
  return (
    <section className="py-20 text-white" style={{ background: "#0D1F3C" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black mb-3">
            Trusted by Nigerian traders every day
          </h2>
          <p className="text-white/60">Real numbers. Real protection.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl md:text-5xl font-black mb-2" style={{ color: "#00A651" }}>
                {s.value}
              </div>
              <div className="text-white/60 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}