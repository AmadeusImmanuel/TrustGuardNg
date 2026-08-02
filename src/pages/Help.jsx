import React, { useState } from "react";
import { ChevronDown, ChevronUp, Search, MessageCircle, Phone, Mail } from "lucide-react";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";

const faqs = [
  { category: "Getting Started", q: "What is TrustGuard?", a: "TrustGuard is Nigeria's leading escrow platform. We hold your payment securely until you confirm satisfactory delivery — protecting both buyers and sellers from fraud." },
  { category: "Getting Started", q: "How do I create an account?", a: "Click 'Get Started' on the homepage, enter your name, email, phone number, and create a password. You can start trading immediately after registration." },
  { category: "Getting Started", q: "Is TrustGuard free to use?", a: "Registration is free. TrustGuard charges a 1.5% escrow fee on each transaction, which can be paid by the buyer, seller, or split 50/50 — you choose when creating a trade." },
  { category: "Payments", q: "How do I fund escrow?", a: "After creating a trade, you receive a dynamic virtual bank account number. Transfer the exact amount from any Nigerian bank app — GTBank, Zenith, Access, UBA, etc. Payment is confirmed in under 5 seconds via bank webhook." },
  { category: "Payments", q: "When are funds released to the seller?", a: "Funds are released when the buyer clicks 'Confirm Delivery'. If the buyer doesn't respond within the agreed auto-release window (set when creating the trade), funds are automatically released to the seller." },
  { category: "Payments", q: "Can I withdraw my wallet balance?", a: "Yes. Go to your Wallet page and click 'Withdraw Funds'. Enter your bank details and the amount. Note: withdrawals above ₦50,000 require KYC verification." },
  { category: "Disputes", q: "What happens if I don't receive my item?", a: "Raise a dispute from the trade detail page within the inspection period. Submit evidence (photos, chats, receipts). Our team will review and resolve within 24-48 hours with a fair ruling." },
  { category: "Disputes", q: "What evidence should I submit in a dispute?", a: "Submit screenshots of your agreement, tracking information, photos of what was received (or not received), bank transfer receipts, and any WhatsApp/chat conversations with the other party." },
  { category: "Security", q: "Is my money safe with TrustGuard?", a: "Yes. All funds are held in a dedicated escrow account. We use AES-256 encryption, bank-grade TLS security, and AI-powered fraud detection. Your money never moves without your confirmation." },
  { category: "Security", q: "What is KYC verification?", a: "Know Your Customer (KYC) is our identity verification process. Level 1 requires email and phone. Level 2 adds government ID. Level 3 verifies NIN. Level 4 is for businesses with CAC registration." },
  { category: "KYC", q: "Why do I need KYC?", a: "KYC helps us verify your identity, prevent fraud, and comply with Nigerian financial regulations. Verified users get higher trust scores and can withdraw larger amounts." },
  { category: "KYC", q: "How long does KYC take?", a: "Level 1 is instant. Levels 2-3 typically take 24 hours. Business verification (Level 4) takes 2-3 business days." },
];

const categories = [...new Set(faqs.map(f => f.category))];

export default function Help() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState(null);

  const filtered = faqs.filter(f => {
    const matchSearch = !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || f.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      {/* Hero */}
      <section className="pt-32 pb-16 text-center text-primary-foreground relative overflow-hidden bg-brand-gradient">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-5xl font-black mb-4">Help Center</h1>
          <p className="text-white/60 mb-8">Find answers to common questions about TrustGuard.</p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card text-foreground text-sm focus:outline-none shadow-elevated"
              placeholder="Search for help..." />
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          {/* Category tabs */}
          <div className="flex gap-2 flex-wrap mb-10">
            {["All", ...categories].map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeCategory === cat ? "text-primary-foreground bg-primary" : "bg-card-hover text-text-secondary hover:bg-card"}`}>
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ accordion */}
          <div className="space-y-3 mb-16">
            {filtered.map((faq, i) => (
              <div key={i} className="border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-colors">
                <button onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left bg-card hover:bg-card-hover transition-colors">
                  <div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full mr-3 bg-primary/10 text-primary">{faq.category}</span>
                    <span className="font-semibold text-foreground text-sm">{faq.q}</span>
                  </div>
                  {openIndex === i ? <ChevronUp className="w-5 h-5 text-muted shrink-0 ml-4" /> : <ChevronDown className="w-5 h-5 text-muted shrink-0 ml-4" />}
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-5 text-text-secondary text-sm leading-relaxed border-t border-border bg-card">
                    <div className="pt-4">{faq.a}</div>
                  </div>
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-muted">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No results found for "{search}"</p>
              </div>
            )}
          </div>

          {/* Contact options */}
          <div className="bg-card-hover rounded-3xl p-10 text-center">
            <h2 className="text-2xl font-black text-foreground mb-2">Still need help?</h2>
            <p className="text-muted mb-8">Our support team is available 24/7.</p>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: MessageCircle, label: "Live Chat", sub: "Avg reply: 2 minutes", action: "Start Chat" },
                { icon: Mail, label: "Email Support", sub: "support@trustguard.ng", action: "Send Email" },
                { icon: Phone, label: "Phone Support", sub: "+234 800 TRUST", action: "Call Now" },
              ].map(({ icon: Icon, label, sub, action }) => (
                <div key={label} className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-elevated transition-shadow cursor-pointer group">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform bg-primary/10">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="font-bold text-foreground mb-1">{label}</div>
                  <div className="text-muted text-xs mb-3">{sub}</div>
                  <button className="px-4 py-2 rounded-full text-primary-foreground text-xs font-semibold bg-primary hover:bg-primary-hover transition-colors">{action}</button>
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
