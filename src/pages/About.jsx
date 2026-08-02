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
    <div className="min-h-screen bg-background">
      <LandingNav />
      {/* Hero */}
      <section className="pt-32 pb-20 text-primary-foreground text-center relative overflow-hidden bg-brand-gradient">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl bg-primary" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 text-white/70 text-sm mb-6">
            <Shield className="w-4 h-4 text-primary" /> About TrustGuard
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            We exist to <span className="text-primary">eliminate fraud</span> in Nigerian trade
          </h1>
          <p className="text-white/70 text-xl max-w-2xl mx-auto leading-relaxed">
            TrustGuard was born from a simple belief: every Nigerian deserves to buy and sell online without fear.
            We built the infrastructure to make that possible.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-6 text-primary-foreground bg-primary">Our Mission</div>
              <h2 className="text-4xl font-black text-foreground mb-6">Making online trust the default, not the exception</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                Nigeria loses billions of naira annually to online trade fraud. Buyers pay for goods that never arrive. Sellers ship items to buyers who reverse payments. The cycle of distrust has held back Nigeria's e-commerce potential.
              </p>
              <p className="text-text-secondary leading-relaxed mb-6">
                TrustGuard changes this by acting as a neutral, technology-powered intermediary. We hold funds securely, verify identities, track deliveries, and resolve disputes — so both parties can trade with complete confidence.
              </p>
              <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-primary-foreground font-semibold text-sm bg-btn-gradient hover:opacity-90 transition-opacity">
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
                <div key={label} className="bg-card-hover rounded-2xl p-6 text-center border border-border">
                  <div className="text-3xl font-black mb-1 text-primary">{value}</div>
                  <div className="text-muted text-sm">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-card-hover/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-foreground mb-4">Our Core Values</h2>
            <p className="text-muted max-w-xl mx-auto">The principles that guide every decision we make at TrustGuard.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-elevated transition-shadow">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-primary/10">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{title}</h3>
                <p className="text-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-foreground mb-4">Meet the Team</h2>
            <p className="text-muted">The people building Nigeria's most trusted escrow platform.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(({ name, role, avatar, bio }) => (
              <div key={name} className="bg-card rounded-2xl p-6 border border-border shadow-sm text-center hover:shadow-elevated transition-shadow">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-primary-foreground font-black text-xl mx-auto mb-4 bg-brand-gradient">
                  {avatar}
                </div>
                <h3 className="font-bold text-foreground mb-1">{name}</h3>
                <div className="text-xs font-semibold mb-3 px-3 py-1 rounded-full inline-block bg-primary/10 text-primary">{role}</div>
                <p className="text-muted text-xs leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-primary-foreground text-center bg-brand-gradient">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-black mb-4">Ready to trade safely?</h2>
          <p className="text-white/60 mb-8">Join thousands of Nigerians who trust TrustGuard every day.</p>
          <Link to="/register" className="inline-block px-8 py-4 rounded-full text-primary-foreground font-bold text-lg hover:opacity-90 transition-all bg-primary">
            Create Free Account →
          </Link>
        </div>
      </section>
      <LandingFooter />
    </div>
  );
}
