import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Lock, Clock, CheckCircle } from "lucide-react";
import FeeCalculator from "@/components/landing/FeeCalculator";
import HowItWorks from "@/components/landing/HowItWorks";
import TrustStats from "@/components/landing/TrustStats";
import Testimonials from "@/components/landing/Testimonials";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-body">
      <LandingNav />

      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0D1F3C 0%, #0a1628 60%, #061020 100%)"
        }}
      >
        {/* Decorative green glow */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #00A651 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-8 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #00A651 0%, transparent 70%)" }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 text-white/80 text-sm font-medium mb-8">
            <Shield className="w-4 h-4" style={{ color: "#00A651" }} />
            Nigeria's Most Trusted Escrow Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] mb-6 tracking-tight">
            Trade with{" "}
            <span style={{ color: "#00A651" }}>Confidence.</span>
            <br />
            Zero Fraud. Zero Risk.
          </h1>

          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed">
            TrustGuard holds your payment securely until you confirm delivery.
            Powered by instant bank transfers — no card details or banking passwords required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="px-8 py-4 rounded-full text-white font-semibold text-lg transition-all hover:opacity-90 hover:scale-105 shadow-lg"
              style={{ background: "#00A651" }}
            >
              Start Trading Free →
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-full text-white font-semibold text-lg border border-white/30 hover:border-white/60 transition-all"
            >
              Sign In
            </Link>
          </div>

          {/* Trust micro-badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-16">
            {[
              { icon: Lock, label: "Bank-Grade Security" },
              { icon: Clock, label: "48-Hr Auto Release" },
              { icon: CheckCircle, label: "Instant Verification" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-white/60 text-sm">
                <Icon className="w-4 h-4" style={{ color: "#00A651" }} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L1440 80L1440 40C1200 80 720 0 0 40L0 80Z" fill="white" />
          </svg>
        </div>
      </section>

      <HowItWorks />
      <TrustStats />
      <Testimonials />
      <FeeCalculator />
      <LandingFooter />
    </div>
  );
}