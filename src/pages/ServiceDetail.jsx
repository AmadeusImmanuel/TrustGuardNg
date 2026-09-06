import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ChevronLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import { getServiceBySlug } from "@/data/services";

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);

  if (!service) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#0D1F3C] text-white">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <Link to="/#services" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-white mb-8 transition-colors">
            <ChevronLeft className="w-4 h-4" /> All Services
          </Link>
          <div className="text-5xl mb-4">{service.emoji}</div>
          <h1 className="text-3xl md:text-4xl font-black mb-3">{service.title}</h1>
          <p className="text-white/70 text-lg max-w-2xl">{service.intro}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-14 space-y-14">
        {/* How it works */}
        <section>
          <h2 className="text-2xl font-black text-[#0D1F3C] mb-6">How It Works</h2>
          <div className="space-y-4">
            {service.howItWorks.map((step, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: "#00A651" }}>
                  {i + 1}
                </div>
                <p className="text-gray-600 pt-1">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Protection */}
        <section>
          <h2 className="text-2xl font-black text-[#0D1F3C] mb-6 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6" style={{ color: "#00A651" }} /> How You're Protected
          </h2>
          <div className="space-y-3">
            {service.protections.map((p, i) => (
              <div key={i} className="flex gap-3 items-start bg-green-50 rounded-2xl p-4">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#00A651" }} />
                <p className="text-gray-700 text-sm">{p}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Fees — pulled from the same platform-wide fee shown elsewhere, not
            hardcoded per service, since the rate is admin-configurable. */}
        <section>
          <h2 className="text-2xl font-black text-[#0D1F3C] mb-4">Fees</h2>
          <p className="text-gray-600">
            TrustGuard charges a small platform fee on every trade, shown upfront when you create one — you choose whether the buyer, seller, or both split it.
            See the <Link to="/#fee-calculator" className="font-semibold hover:underline" style={{ color: "#00A651" }}>fee calculator</Link> for the current rate.
          </p>
        </section>

        {/* FAQs */}
        <section>
          <h2 className="text-2xl font-black text-[#0D1F3C] mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {service.faqs.map((f, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl p-5">
                <div className="font-bold text-[#0D1F3C] mb-2">{f.q}</div>
                <div className="text-gray-500 text-sm">{f.a}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-10 rounded-3xl bg-gray-50">
          <h3 className="text-xl font-black text-[#0D1F3C] mb-3">Ready to trade safely?</h3>
          <p className="text-gray-500 text-sm mb-6">Create a protected {service.title.toLowerCase()} trade in minutes.</p>
          <Link to="/trades/new" className="inline-block px-8 py-3.5 rounded-full text-white font-bold text-sm shadow-lg hover:opacity-90 transition-opacity" style={{ background: "#00A651" }}>
            Start a Trade →
          </Link>
        </section>
      </div>
    </div>
  );
}
