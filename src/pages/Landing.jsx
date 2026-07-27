import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, Lock, Clock, CheckCircle, ArrowRight, Star, Zap, Users, TrendingUp, Award } from "lucide-react";
import FeeCalculator from "@/components/landing/FeeCalculator";
import HowItWorks from "@/components/landing/HowItWorks";
import TrustStats from "@/components/landing/TrustStats";
import Testimonials from "@/components/landing/Testimonials";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import Services from "@/components/landing/Services";
import TransactionTracker from "@/components/landing/TransactionTracker";
import TrustBadges from "@/components/landing/TrustBadges";
import MobileAppSection from "@/components/landing/MobileAppSection";

export default function Landing() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div className="min-h-screen bg-white font-body">
      <LandingNav />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0D1F3C 0%, #0a1628 60%, #061020 100%)" }}>
        {/* Animated glow following mouse */}
        <div className="absolute inset-0 pointer-events-none transition-all duration-700"
          style={{ background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0,166,81,0.07), transparent 40%)` }} />
        {/* Static glows */}
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #00A651, transparent 70%)" }} />
        <div className="absolute bottom-20 left-10 w-72 h-72 rounded-full opacity-8 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #00A651, transparent 70%)" }} />
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute rounded-full opacity-20 animate-pulse"
            style={{
              width: `${8 + i * 4}px`, height: `${8 + i * 4}px`,
              background: "#00A651",
              top: `${15 + i * 13}%`, left: `${5 + i * 16}%`,
              animationDelay: `${i * 0.5}s`, animationDuration: `${2 + i}s`
            }} />
        ))}

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-white/80 text-sm font-medium mb-8">
            <Shield className="w-4 h-4" style={{ color: "#00A651" }} />
            Nigeria's Most Trusted Escrow Platform
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] mb-6 tracking-tight">
            Buy and Sell with{" "}
            <span className="relative inline-block">
              <span style={{ color: "#00A651" }}>Confidence.</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M0 8 Q150 0 300 8" stroke="#00A651" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
              </svg>
            </span>
            <br />
            <span className="text-white/90">Zero Fraud. Zero Risk.</span>
          </h1>

          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed">
            TrustGuard securely holds your payment until you confirm satisfactory delivery.
            Powered by instant bank transfers — no card details required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/register"
              className="group px-8 py-4 rounded-full text-white font-semibold text-lg transition-all hover:opacity-90 hover:scale-105 shadow-2xl flex items-center gap-2"
              style={{ background: "linear-gradient(135deg, #00A651, #00c860)" }}>
              Start Transaction Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login"
              className="px-8 py-4 rounded-full text-white font-semibold text-lg border border-white/30 hover:border-white/60 hover:bg-white/5 transition-all">
              Sign In
            </Link>
          </div>

          {/* Escrow Flow Illustration */}
          <div className="flex items-center justify-center gap-4 md:gap-8 mb-16">
            {[
              { label: "Buyer", icon: "👤", color: "#163560" },
              { label: "↓", icon: null, color: null },
              { label: "TrustGuard Escrow", icon: "🛡️", color: "#00A651", featured: true },
              { label: "↓", icon: null, color: null },
              { label: "Seller", icon: "🏪", color: "#163560" },
            ].map((item, i) => item.icon ? (
              <div key={i} className={`flex flex-col items-center gap-2 px-4 py-3 rounded-2xl border transition-all ${item.featured ? "border-green-400/50 scale-110" : "border-white/10"}`}
                style={{ background: item.featured ? "rgba(0,166,81,0.15)" : "rgba(255,255,255,0.05)" }}>
                <span className="text-2xl">{item.icon}</span>
                <span className={`text-xs font-semibold ${item.featured ? "text-green-400" : "text-white/60"}`}>{item.label}</span>
              </div>
            ) : (
              <div key={i} className="text-green-400 text-xl font-bold animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}>
                {item.label}
              </div>
            ))}
          </div>

          {/* Trust micro-badges */}
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { icon: Lock, label: "Bank-Grade Security" },
              { icon: Clock, label: "Auto-Release Timer" },
              { icon: CheckCircle, label: "Instant Verification" },
              { icon: Zap, label: "< 5s Confirmation" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-white/60 text-sm bg-white/5 px-4 py-2 rounded-full border border-white/10">
                <Icon className="w-4 h-4" style={{ color: "#00A651" }} />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L1440 80L1440 40C1200 80 720 0 0 40L0 80Z" fill="white" />
          </svg>
        </div>
      </section>

      <TrustStats />
      <HowItWorks />
      <WhyChooseUs />
      <Services />
      <Testimonials />
      <FeeCalculator />
      <TransactionTracker />
      <TrustBadges />
      <MobileAppSection />
      <LandingFooter />
    </div>
  );
}
