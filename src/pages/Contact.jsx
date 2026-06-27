import React from "react";
import { Mail, MessageCircle, MapPin } from "lucide-react";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";

export default function Contact() {
  return (
    <div className="min-h-screen bg-white font-body">
      <LandingNav />

      <section
        className="relative py-20 px-6"
        style={{
          background: "linear-gradient(135deg, #0D1F3C 0%, #0a1628 60%, #061020 100%)"
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Contact Us
          </h1>
          <p className="text-white/70 text-lg">
            We're here to help with trades, disputes, or general questions.
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(0,166,81,0.1)" }}
            >
              <Mail className="w-6 h-6" style={{ color: "#00A651" }} />
            </div>
            <h3 className="font-bold mb-2" style={{ color: "#0D1F3C" }}>
              Email
            </h3>
            <a
              href="mailto:support@trustguardng.com"
              className="text-sm hover:underline"
              style={{ color: "#00A651" }}
            >
              support@trustguardng.com
            </a>
          </div>

          <div className="text-center p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(0,166,81,0.1)" }}
            >
              <MessageCircle className="w-6 h-6" style={{ color: "#00A651" }} />
            </div>
            <h3 className="font-bold mb-2" style={{ color: "#0D1F3C" }}>
              Live Support
            </h3>
            <p className="text-sm text-gray-600">
              Available for registered users from your Wallet page
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(0,166,81,0.1)" }}
            >
              <MapPin className="w-6 h-6" style={{ color: "#00A651" }} />
            </div>
            <h3 className="font-bold mb-2" style={{ color: "#0D1F3C" }}>
              Location
            </h3>
            <p className="text-sm text-gray-600">Abakaliki, Ebonyi State, Nigeria</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto mt-12 text-center">
          <p className="text-gray-600 leading-relaxed">
            For trade disputes, please use the{" "}
            <span className="font-semibold" style={{ color: "#0D1F3C" }}>
              Disputes
            </span>{" "}
            section in your dashboard so we have full visibility into your trade details.
            For everything else, email us and we'll respond within 1–2 business days.
          </p>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
