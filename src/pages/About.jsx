import React from "react";
import { Link } from "react-router-dom";
import { Shield, Target, Heart, Users, Award, TrendingUp } from "lucide-react";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";

const team = [
  { name: "Amadeus Okonkwo", role: "CEO & Founder", avatar: "AO", bio: "Cybersecurity expert with 10+ years building secure financial systems across West Africa." },
  { name: "Chisom Eze", role: "CTO", avatar: "CE", bio: "Full-stack engineer and fintech architect. Previously at Flutterwave and Paystack." },
  { name: "Fatima Bello", role: "Head of Compliance", avatar: "FB", bio: "Regulatory and AML specialist. Ensures TrustGuard meets CBN and NDIC standards." },
  { name: "Emeka Nwachi", role: "Head of Trust & Safety", avatar: "EN", bio: "Fraud prevention expert. Built Nigeria's first AI-powered escrow risk engine." },
];

const values = [
  { icon: Shield, title: "Trust First", desc: "Every decision we make starts with one question: does this protect our users?" },
  { icon: Target, title: "Transparency", desc: "No hidden fees. No fine print surprises. What you see is exactly what you get." },
  { icon: Heart, title: "Built for Nigerians", desc: "We understand the unique challenges of Nigerian e-commerce and build solutions that fit." },
  { icon: TrendingUp, title: "Continuous Innovation", desc: "We never stop improving. AI fraud detection, instant webhooks, auto-release timers — always evolving." },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNav />
      {/* Hero */}
      <section className="pt-32 pb-20 text-white text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0D1F3C 0%, #163560 100%)" }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: "#00A651" }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 text-white/70 text-sm mb-6">
            <Shield className="w-4 h-4" style={{ color: "#00A651" }} /> About TrustGuard
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            We exist to <span style={{ color: "#00A651" }}>eliminate fraud</span> in Nigerian trade
          </h1>
          <p className="text-white/70 text-xl max-w-2xl mx-auto leading-relaxed">
            TrustGuard was born from a simple belief: every Nigerian deserves to buy and sell online without fear.
            We built the infrastructure to make that possible.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-6 text-white" style={{ background: "#00A651" }}>Our Mission</div>
              <h2 className="text-4xl font-black text-[#0D1F3C] mb-6">Making online trust the default, not the exception</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Nigeria loses billions of naira annually to online trade fraud. Buyers pay for goods that never arrive. Sellers ship items to buyers who reverse payments. The cycle of distrust has held back Nigeria's e-commerce potential.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                TrustGuard changes this by acting as a neutral, technology-powered intermediary. We hold funds securely, verify identities, track deliveries, and resolve disputes — so both parties can trade with complete confidence.
              </p>
              <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm"
                style={{ background: "#00A651" }}>
                Join TrustGuard Today →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "₦2.4B+", label: "Protected" },
                { value: "48K+", label: "Trades" },
                { value: "99.8%", label: "Success Rate" },
                { value: "2024", label: "Founded" },
              ].map(({ value, label }) => (
                <div key={label} className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
                  <div className="text-3xl font-black mb-1" style={{ color: "#00A651" }}>{value}</div>
                  <div className="text-gray-500 text-sm">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-[#0D1F3C] mb-4">Our Core Values</h2>
            <p className="text-gray-500 max-w-xl mx-auto">The principles that guide every decision we make at TrustGuard.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "#f0fff7" }}>
                  <Icon className="w-6 h-6" style={{ color: "#00A651" }} />
                </div>
                <h3 className="font-bold text-[#0D1F3C] mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-[#0D1F3C] mb-4">Meet the Team</h2>
            <p className="text-gray-500">The people building Nigeria's most trusted escrow platform.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(({ name, role, avatar, bio }) => (
              <div key={name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center hover:shadow-md transition-all">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl mx-auto mb-4"
                  style={{ background: "linear-gradient(135deg, #0D1F3C, #163560)" }}>
                  {avatar}
                </div>
                <h3 className="font-bold text-[#0D1F3C] mb-1">{name}</h3>
                <div className="text-xs font-semibold mb-3 px-3 py-1 rounded-full inline-block" style={{ background: "#f0fff7", color: "#00A651" }}>{role}</div>
                <p className="text-gray-500 text-xs leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-white text-center" style={{ background: "#0D1F3C" }}>
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-black mb-4">Ready to trade safely?</h2>
          <p className="text-white/60 mb-8">Join thousands of Nigerians who trust TrustGuard every day.</p>
          <Link to="/register" className="inline-block px-8 py-4 rounded-full text-white font-bold text-lg hover:opacity-90 transition-all"
            style={{ background: "#00A651" }}>
            Create Free Account →
          </Link>
        </div>
      </section>
      <LandingFooter />
    </div>
  );
}
