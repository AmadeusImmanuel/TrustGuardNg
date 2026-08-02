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

const categoryClasses = {
  Education: "bg-success/10 text-success",
  Safety: "bg-danger/10 text-danger",
  Guide: "bg-info/10 text-info",
  Freelancing: "bg-warning/10 text-warning",
};

export default function Blog() {
  const featured = posts.find(p => p.featured);
  const rest = posts.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <section className="pt-32 pb-20 text-primary-foreground text-center relative overflow-hidden bg-brand-gradient">
        <div className="max-w-3xl mx-auto px-6">
          <div className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-white/20 bg-white/5 text-white/70">Learning Center</div>
          <h1 className="text-5xl font-black mb-4">TrustGuard Blog</h1>
          <p className="text-white/60 text-lg">Safety guides, tips, and insights for Nigerian traders.</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          {/* Featured post */}
          {featured && (
            <div className="rounded-3xl overflow-hidden border border-border shadow-elevated mb-12 bg-card-hover">
              <div className="p-10 md:p-14">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${categoryClasses[featured.category]}`}>
                    {featured.category}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-warning/10 text-warning">⭐ Featured</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4 max-w-2xl">{featured.title}</h2>
                <p className="text-muted text-lg leading-relaxed mb-6 max-w-2xl">{featured.excerpt}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-muted text-sm"><Clock className="w-4 h-4" /> {featured.readTime} read</div>
                  <span className="text-disabled">·</span>
                  <span className="text-muted text-sm">{featured.date}</span>
                  <Link to={`/blog/${featured.slug}`} className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-full text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all bg-primary">
                    Read Article <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Post grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map(post => (
              <Link key={post.slug} to={`/blog/${post.slug}`}
                className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-elevated transition-all hover:-translate-y-1 group">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${categoryClasses[post.category] || categoryClasses.Education}`}>{post.category}</span>
                  <span className="text-muted text-xs">{post.date}</span>
                </div>
                <h3 className="font-black text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-muted text-sm leading-relaxed mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-2 text-muted text-xs">
                  <Clock className="w-3 h-3" /> {post.readTime} read
                  <ArrowRight className="w-3 h-3 ml-auto text-primary group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <LandingFooter />
    </div>
  );
}
