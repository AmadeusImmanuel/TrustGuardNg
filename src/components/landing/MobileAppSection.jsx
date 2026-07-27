import React from "react";
import { Smartphone, Bell, Zap, Shield } from "lucide-react";

export default function MobileAppSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="rounded-3xl p-12 md:p-16 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0D1F3C 0%, #163560 100%)" }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
            style={{ background: "#00A651" }} />
          <div className="flex-1 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 text-white/70 text-xs font-medium mb-6">
              <Smartphone className="w-3 h-3" /> Coming Soon
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              TrustGuard <span style={{ color: "#00A651" }}>Mobile App</span>
            </h2>
            <p className="text-white/60 mb-8 leading-relaxed">
              Manage your escrow trades on the go. Real-time notifications, instant payments, and complete transaction control — right from your pocket.
            </p>
            <div className="space-y-3 mb-8">
              {[
                { icon: Bell, text: "Instant push notifications" },
                { icon: Zap, text: "One-tap payment confirmation" },
                { icon: Shield, text: "Biometric security" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-white/70 text-sm">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(0,166,81,0.2)" }}>
                    <Icon className="w-3 h-3" style={{ color: "#00A651" }} />
                  </div>
                  {text}
                </div>
              ))}
            </div>
            <div className="flex gap-4 flex-wrap">
              {["App Store", "Google Play"].map((store) => (
                <button key={store} className="flex items-center gap-3 px-5 py-3 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 transition-all">
                  <Smartphone className="w-5 h-5 text-white/60" />
                  <div className="text-left">
                    <div className="text-white/40 text-xs">Download on</div>
                    <div className="text-white font-semibold text-sm">{store}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="relative z-10 flex-shrink-0">
            <div className="w-48 h-80 rounded-3xl border-4 border-white/20 bg-white/10 backdrop-blur-sm flex flex-col items-center justify-center gap-4 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: "#00A651" }}>
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div className="text-white font-black text-lg">TrustGuard</div>
              <div className="text-white/40 text-xs">v2.0 Coming Soon</div>
              <div className="w-24 h-1 rounded-full" style={{ background: "#00A651" }} />
              <div className="space-y-2 w-32">
                {[80, 60, 90].map((w, i) => (
                  <div key={i} className="h-2 rounded-full bg-white/10" style={{ width: `${w}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
