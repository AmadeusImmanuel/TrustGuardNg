import React from "react";
import { PlusCircle, UserCheck, Wallet, Package, CheckCircle, Banknote } from "lucide-react";

const steps = [
  { number: "01", icon: PlusCircle, title: "Buyer Creates Transaction", desc: "Buyer fills in trade details — item name, amount, seller email, and agreed delivery window.", color: "#00A651" },
  { number: "02", icon: UserCheck, title: "Seller Accepts", desc: "Seller receives notification and confirms they have the item ready to ship.", color: "#0D1F3C" },
  { number: "03", icon: Wallet, title: "Buyer Funds Escrow", desc: "Buyer receives a dynamic virtual bank account and transfers funds from any Nigerian bank app.", color: "#00A651" },
  { number: "04", icon: Package, title: "Seller Delivers", desc: "Once payment is confirmed, seller ships the item and enters dispatch details with tracking info.", color: "#0D1F3C" },
  { number: "05", icon: CheckCircle, title: "Buyer Confirms", desc: "Buyer inspects the item and confirms satisfactory delivery. Funds are released instantly.", color: "#00A651" },
  { number: "06", icon: Banknote, title: "TrustGuard Releases Payment", desc: "Seller receives funds directly to their TrustGuard wallet, ready for withdrawal anytime.", color: "#0D1F3C" },
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
            Six steps to fraud-free trading
          </h2>
          <p className="text-gray-500 mt-4 text-lg max-w-xl mx-auto">
            Built for Nigerian social commerce — WhatsApp vendors, Instagram sellers, Jiji traders.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative group">
                <div className="relative bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  {/* Step number circle */}
                  <div className="absolute -top-4 left-8 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black shadow-lg"
                    style={{ background: step.color }}>
                    {i + 1}
                  </div>
                  <div className="flex items-center gap-4 mb-6 mt-2">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: step.color === "#00A651" ? "#f0fff7" : "#f0f4ff" }}>
                      <step.icon className="w-6 h-6" style={{ color: step.color }} />
                    </div>
                    <span className="text-4xl font-black text-gray-100">{step.number}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#0D1F3C] mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-14">
          <a href="/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-base transition-all hover:opacity-90 hover:scale-105 shadow-lg"
            style={{ background: "linear-gradient(135deg, #00A651, #00c860)" }}>
            Create a Secure Trade Now →
          </a>
        </div>
      </div>
    </section>
  );
}
