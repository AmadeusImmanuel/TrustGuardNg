import React from "react";

const services = [
  { emoji: "📱", title: "Electronics", desc: "Phones, laptops, gadgets" },
  { emoji: "🚗", title: "Vehicles", desc: "Cars, bikes, spare parts" },
  { emoji: "🏠", title: "Real Estate", desc: "Rent deposits, land deals" },
  { emoji: "🧱", title: "Building Materials", desc: "Cement, tiles, iron rods" },
  { emoji: "💻", title: "Freelancing", desc: "Design, writing, coding" },
  { emoji: "🎯", title: "Digital Services", desc: "Software, courses, data" },
  { emoji: "🌍", title: "Import & Export", desc: "International trade" },
  { emoji: "🌾", title: "Agriculture", desc: "Crops, livestock, feeds" },
  { emoji: "📦", title: "Wholesale", desc: "Bulk goods, distributors" },
  { emoji: "🛒", title: "Marketplace", desc: "Jiji, Instagram, WhatsApp" },
  { emoji: "📋", title: "Contracts", desc: "Business agreements" },
  { emoji: "👗", title: "Fashion", desc: "Clothing, shoes, bags" },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4 text-white" style={{ background: "#00A651" }}>
            Our Services
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#0D1F3C]">
            Escrow for every transaction
          </h2>
          <p className="text-gray-500 mt-4 text-lg max-w-xl mx-auto">
            From electronics to real estate — TrustGuard protects every kind of Nigerian trade.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {services.map(({ emoji, title, desc }) => (
            <div key={title} className="group p-5 rounded-2xl border border-gray-100 hover:border-green-200 bg-white hover:bg-green-50 transition-all duration-300 hover:-translate-y-1 cursor-pointer text-center">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform inline-block">{emoji}</div>
              <div className="font-bold text-[#0D1F3C] text-sm mb-1">{title}</div>
              <div className="text-gray-400 text-xs">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
