import React from "react";
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";

const posts = [
  { slug: "how-escrow-works", title: "How Escrow Works: A Complete Guide for Nigerian Traders", excerpt: "Everything you need to know about escrow — how it protects buyers and sellers, and why it's the future of Nigerian e-commerce.", category: "Education", readTime: "5 min", date: "Jan 15, 2026", featured: true },
  { slug: "avoid-online-scams", title: "10 Ways to Avoid Online Scams in Nigeria in 2026", excerpt: "Scammers are getting smarter. Here's how to protect yourself when buying and selling online — from fake bank alerts to delivery fraud.", category: "Safety", readTime: "7 min", date: "Jan 10, 2026", featured: false },
  { slug: "safe-buying-guide", title: "The Ultimate Safe Buying Guide for Nigerian Buyers", excerpt: "Step-by-step guide to making safe purchases online — whether you're buying electronics, fashion, or vehicles.", category: "Guide", readTime: "6 min", date: "Jan 5, 2026", featured: false },
  { slug: "safe-selling-guide", title: "Safe Selling in Nigeria: Protect Your Business Online", excerpt: "How to protect yourself from fake payment alerts, delivery fraud, and chargeback scams as a Nigerian seller.", category: "Guide", readTime: "8 min", date: "Dec 28, 2025", featured: false },
  { slug: "jiji-instagram-safety", title: "Buying on Jiji and Instagram? Here's How to Stay Safe", excerpt: "Social commerce is booming in Nigeria — but so is fraud. Here's how to use TrustGuard to protect every transaction.", category: "Safety", readTime: "4 min", date: "Dec 20, 2025", featured: false },
  { slug: "escrow-for-freelancers", title: "Escrow for Nigerian Freelancers: Get Paid Every Time", excerpt: "Tired of clients who disappear after you deliver? Escrow guarantees your payment before you start work.", category: "Freelancing", readTime: "5 min", date: "Dec 15, 2025", featured: false },
];

const categoryColors = {
  Education: { bg: "#f0fff7", color: "#00A651" },
  Safety: { bg: "#fef2f2", color: "#dc2626" },
  Guide: { bg: "#eff6ff", color: "#2563eb" },
  Freelancing: { bg: "#f5f3ff", color: "#7c3aed" },
};

export default function Blog() {
  const featured = posts.find(p => p.featured);
  const rest = posts.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-white">
      <LandingNav />
      <section className="pt-32 pb-20 text-white text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0D1F3C 0%, #163560 100%)" }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-white/20 bg-white/5 text-white/70">Learning Center</div>
          <h1 className="text-5xl font-black mb-4">TrustGuard Blog</h1>
          <p className="text-white/60 text-lg">Safety guides, tips, and insights for Nigerian traders.</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none"><path d="M0 40L1440 40L1440 20C1200 40 720 0 0 20L0 40Z" fill="white" /></svg>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Featured post */}
          {featured && (
            <div className="rounded-3xl overflow-hidden border border-gray-100 shadow-lg mb-12 bg-gradient-to-br from-gray-50 to-white">
              <div className="p-10 md:p-14">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: categoryColors[featured.category]?.bg, color: categoryColors[featured.category]?.color }}>
                    {featured.category}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-700">⭐ Featured</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-[#0D1F3C] mb-4 max-w-2xl">{featured.title}</h2>
                <p className="text-gray-500 text-lg leading-relaxed mb-6 max-w-2xl">{featured.excerpt}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-gray-400 text-sm"><Clock className="w-4 h-4" /> {featured.readTime} read</div>
                  <span className="text-gray-300">·</span>
                  <span className="text-gray-400 text-sm">{featured.date}</span>
                  <Link to={`/blog/${featured.slug}`} className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold hover:opacity-90 transition-all"
                    style={{ background: "#00A651" }}>
                    Read Article <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Post grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map(post => {
              const catStyle = categoryColors[post.category] || { bg: "#f0fff7", color: "#00A651" };
              return (
                <Link key={post.slug} to={`/blog/${post.slug}`}
                  className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: catStyle.bg, color: catStyle.color }}>{post.category}</span>
                    <span className="text-gray-400 text-xs">{post.date}</span>
                  </div>
                  <h3 className="font-black text-[#0D1F3C] mb-3 leading-tight group-hover:text-green-700 transition-colors">{post.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <Clock className="w-3 h-3" /> {post.readTime} read
                    <ArrowRight className="w-3 h-3 ml-auto group-hover:translate-x-1 transition-transform" style={{ color: "#00A651" }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <LandingFooter />
    </div>
  );
}
