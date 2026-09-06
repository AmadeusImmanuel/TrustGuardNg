import React from "react";
import { Shield, Lock, Building, Star, CheckCircle, AlertTriangle } from "lucide-react";

const badges = [
  { icon: Lock, label: "SSL Secured", sub: "256-bit TLS encryption" },
  { icon: Shield, label: "Fraud Prevention", sub: "Real-time risk monitoring" },
  { icon: Building, label: "CAC Registered", sub: "Amadeus Cybernetics Ltd" },
  { icon: CheckCircle, label: "Money Protected", sub: "Escrow-backed guarantee" },
  { icon: AlertTriangle, label: "Dispute Coverage", sub: "Every trade, every time" },
];

export default function TrustBadges() {
  return (
    <section className="py-20" style={{ background: "#0D1F3C" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-white mb-3">Your Money is Safe With Us</h2>
          <p className="text-white/50">Enterprise-grade security. Nigerian regulatory compliance.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {badges.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,166,81,0.15)" }}>
                <Icon className="w-6 h-6" style={{ color: "#00A651" }} />
              </div>
              <div>
                <div className="text-white text-xs font-bold">{label}</div>
                <div className="text-white/40 text-xs mt-0.5">{sub}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          {/* TODO: add real CAC registration number here once available */}
          <p className="text-white/30 text-sm">Powered by <span className="text-white/60 font-semibold">Amadeus Cybernetics Limited</span></p>
        </div>
      </div>
    </section>
  );
}
