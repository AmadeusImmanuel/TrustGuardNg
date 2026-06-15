import React from "react";
import { Wallet, Package, CheckCircle } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Wallet,
    title: "Fund Escrow",
    desc: "Buyer creates a trade and receives a dynamic virtual bank account. Transfer funds via your banking app — confirmed in seconds via webhook.",
    color: "#00A651",
  },
  {
    number: "02",
    icon: Package,
    title: "Seller Ships",
    desc: "Seller is notified the moment funds are confirmed. They dispatch the item and enter rider details so the buyer can track directly.",
    color: "#0D1F3C",
  },
  {
    number: "03",
    icon: CheckCircle,
    title: "Confirm & Release",
    desc: "Buyer confirms delivery — funds instantly credited to seller's wallet. If no action in 48hrs, funds auto-release for safety.",
    color: "#00A651",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4 text-white" style={{ background: "#00A651" }}>
            How It Works
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#0D1F3C] leading-tight">
            Three steps to fraud-free trading
          </h2>
          <p className="text-gray-500 mt-4 text-lg max-w-xl mx-auto">
            Built for Nigerian social commerce — WhatsApp vendors, Instagram sellers, Jiji traders.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative group">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-gray-200 to-transparent z-0" />
              )}
              <div className="relative bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: step.color === "#00A651" ? "#f0fff7" : "#f0f4ff" }}
                  >
                    <step.icon className="w-6 h-6" style={{ color: step.color }} />
                  </div>
                  <span className="text-4xl font-black text-gray-100">{step.number}</span>
                </div>
                <h3 className="text-xl font-bold text-[#0D1F3C] mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}