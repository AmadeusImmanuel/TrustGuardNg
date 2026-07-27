import React, { useState } from "react";
import { Mail, Phone, MapPin, MessageCircle, Clock } from "lucide-react";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <LandingNav />
      <section className="pt-32 pb-20 text-white text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0D1F3C 0%, #163560 100%)" }}>
        <div className="relative max-w-2xl mx-auto px-6">
          <h1 className="text-5xl font-black mb-4">Contact Us</h1>
          <p className="text-white/60 text-lg">We're here to help. Reach out through any channel below.</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none"><path d="M0 40L1440 40L1440 20C1200 40 720 0 0 20L0 40Z" fill="white" /></svg>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-black text-[#0D1F3C] mb-8">Get in Touch</h2>
              {sent ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                  <div className="text-4xl mb-4">✅</div>
                  <h3 className="font-bold text-[#0D1F3C] text-xl mb-2">Message Sent!</h3>
                  <p className="text-gray-500">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { label: "Full Name", key: "name", type: "text", placeholder: "John Doe" },
                    { label: "Email Address", key: "email", type: "email", placeholder: "you@email.com" },
                    { label: "Subject", key: "subject", type: "text", placeholder: "How can we help?" },
                  ].map(({ label, key, type, placeholder }) => (
                    <div key={key}>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                      <input type={type} required value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500"
                        placeholder={placeholder} />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message</label>
                    <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500 resize-none"
                      placeholder="Describe your issue or question in detail..." />
                  </div>
                  <button type="submit" className="w-full py-3.5 rounded-full text-white font-bold text-sm hover:opacity-90 transition-all"
                    style={{ background: "#00A651" }}>Send Message →</button>
                </form>
              )}
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-black text-[#0D1F3C] mb-8">Contact Information</h2>
              {[
                { icon: Mail, title: "Email Support", detail: "support@trustguard.ng", sub: "For general inquiries and disputes" },
                { icon: Phone, title: "Phone Support", detail: "+234 800 TRUST", sub: "Mon-Fri, 8AM-8PM WAT" },
                { icon: MessageCircle, title: "WhatsApp", detail: "+234 810 000 0000", sub: "Quick responses for urgent issues" },
                { icon: MapPin, title: "Office Address", detail: "Victoria Island, Lagos", sub: "Amadeus Cybernetics Limited HQ" },
                { icon: Clock, title: "Response Time", detail: "Under 2 hours", sub: "Average first response time" },
              ].map(({ icon: Icon, title, detail, sub }) => (
                <div key={title} className="flex gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-sm transition-all">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#f0fff7" }}>
                    <Icon className="w-5 h-5" style={{ color: "#00A651" }} />
                  </div>
                  <div>
                    <div className="font-bold text-[#0D1F3C] text-sm">{title}</div>
                    <div className="font-semibold mt-0.5" style={{ color: "#00A651" }}>{detail}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <LandingFooter />
    </div>
  );
}
