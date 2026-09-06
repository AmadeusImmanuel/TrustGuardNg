import React from "react";
import { Shield, Zap, Users, Lock, AlertTriangle, Bell, Star, TrendingUp, Clock, Headphones } from "lucide-react";

const features = [
  { icon: Shield, title: "Secure Escrow", desc: "Funds held in a secure escrow account — released only when you confirm delivery.", color: "#00A651" },
  { icon: Zap, title: "Smart Fraud Detection", desc: "Our system flags suspicious transactions, unusual trade velocity, and risk patterns in real time.", color: "#2563eb" },
  { icon: Users, title: "Verified Users", desc: "KYC verification with live BVN checks, so you know who you're trading with.", color: "#7c3aed" },
  { icon: Lock, title: "Encrypted Payments", desc: "Bank-grade TLS encryption on every trade, with passwords protected using industry-standard hashing.", color: "#dc2626" },
  { icon: AlertTriangle, title: "Fast Dispute Resolution", desc: "Admin-mediated disputes with full evidence review — photos, videos, and message history.", color: "#d97706" },
  { icon: TrendingUp, title: "Transaction Tracking", desc: "Real-time status updates from payment received to delivery confirmed.", color: "#059669" },
  { icon: Star, title: "Buyer Protection", desc: "Full refund if seller doesn't ship or item doesn't match description.", color: "#00A651" },
  { icon: Bell, title: "Real-Time Notifications", desc: "Instant email and in-app alerts at every stage of your transaction.", color: "#2563eb" },
  { icon: Clock, title: "Auto-Release Timer", desc: "Agreed auto-release window protects sellers from buyers who ghost after delivery.", color: "#7c3aed" },
  { icon: Headphones, title: "24/7 Customer Support", desc: "Dedicated support team available round the clock for urgent trade issues.", color: "#dc2626" },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4 text-white" style={{ background: "#0D1F3C" }}>
            Why TrustGuard
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#0D1F3C] leading-tight">
            Built for trust. <span style={{ color: "#00A651" }}>Engineered for safety.</span>
          </h2>
          <p className="text-gray-500 mt-4 text-lg max-w-xl mx-auto">
            Every feature is designed to protect both buyers and sellers in Nigerian e-commerce.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ background: color + "15" }}>
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <h3 className="font-bold text-[#0D1F3C] mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
