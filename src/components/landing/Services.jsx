import React from "react";
import { Link } from "react-router-dom";
import services from "@/data/services";

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
          {services.map(({ slug, emoji, title, desc }) => (
            <Link key={slug} to={`/services/${slug}`} className="group p-5 rounded-2xl border border-gray-100 hover:border-green-200 bg-white hover:bg-green-50 transition-all duration-300 hover:-translate-y-1 cursor-pointer text-center block">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform inline-block">{emoji}</div>
              <div className="font-bold text-[#0D1F3C] text-sm mb-1">{title}</div>
              <div className="text-gray-400 text-xs">{desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
