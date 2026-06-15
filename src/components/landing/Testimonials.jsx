import React from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Adaeze Okonkwo",
    role: "Instagram Fashion Vendor, Lagos",
    avatar: "AO",
    quote: "Before TrustGuard, I lost ₦85,000 to buyers who claimed 'it doesn't fit' after delivery. Now I ship with full confidence. The auto-release timer means I always get paid.",
    stars: 5,
  },
  {
    name: "Emeka Chukwu",
    role: "Electronics Buyer, Abuja",
    avatar: "EC",
    quote: "The virtual bank account is genius. I transferred directly from my GTBank app, got a confirmation in 4 seconds, and the seller shipped same day. Zero stress.",
    stars: 5,
  },
  {
    name: "Fatima Usman",
    role: "Thrift Seller, Kano",
    avatar: "FU",
    quote: "The dispatch rider phone number feature is everything. My buyers can call the rider directly — I've had zero 'where is my package?' messages since I started using TrustGuard.",
    stars: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4 text-white" style={{ background: "#0D1F3C" }}>
            Testimonials
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#0D1F3C]">
            Real traders. Real results.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex gap-1 mb-4">
                {Array(t.stars).fill(0).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" style={{ color: "#00A651" }} />
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed mb-6 text-sm italic">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: "#0D1F3C" }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-[#0D1F3C] text-sm">{t.name}</div>
                  <div className="text-gray-500 text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}