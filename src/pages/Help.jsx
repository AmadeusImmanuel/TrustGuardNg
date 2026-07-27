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
    <div className="min-h-screen bg-white">
      <LandingNav />
      {/* Hero */}
      <section className="pt-32 pb-16 text-center text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0D1F3C 0%, #163560 100%)" }}>
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-5xl font-black mb-4">Help Center</h1>
          <p className="text-white/60 mb-8">Find answers to common questions about TrustGuard.</p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-800 text-sm focus:outline-none shadow-lg"
              placeholder="Search for help..." />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none"><path d="M0 40L1440 40L1440 20C1200 40 720 0 0 20L0 40Z" fill="white" /></svg>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Category tabs */}
          <div className="flex gap-2 flex-wrap mb-10">
            {["All", ...categories].map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeCategory === cat ? "text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                style={activeCategory === cat ? { background: "#00A651" } : {}}>
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ accordion */}
          <div className="space-y-3 mb-16">
            {filtered.map((faq, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden hover:border-green-200 transition-colors">
                <button onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors">
                  <div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full mr-3" style={{ background: "#f0fff7", color: "#00A651" }}>{faq.category}</span>
                    <span className="font-semibold text-[#0D1F3C] text-sm">{faq.q}</span>
                  </div>
                  {openIndex === i ? <ChevronUp className="w-5 h-5 text-gray-400 shrink-0 ml-4" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0 ml-4" />}
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-50 bg-white">
                    <div className="pt-4">{faq.a}</div>
                  </div>
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No results found for "{search}"</p>
              </div>
            )}
          </div>

          {/* Contact options */}
          <div className="bg-gray-50 rounded-3xl p-10 text-center">
            <h2 className="text-2xl font-black text-[#0D1F3C] mb-2">Still need help?</h2>
            <p className="text-gray-500 mb-8">Our support team is available 24/7.</p>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: MessageCircle, label: "Live Chat", sub: "Avg reply: 2 minutes", action: "Start Chat" },
                { icon: Mail, label: "Email Support", sub: "support@trustguard.ng", action: "Send Email" },
                { icon: Phone, label: "Phone Support", sub: "+234 800 TRUST", action: "Call Now" },
              ].map(({ icon: Icon, label, sub, action }) => (
                <div key={label} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform" style={{ background: "#f0fff7" }}>
                    <Icon className="w-6 h-6" style={{ color: "#00A651" }} />
                  </div>
                  <div className="font-bold text-[#0D1F3C] mb-1">{label}</div>
                  <div className="text-gray-400 text-xs mb-3">{sub}</div>
                  <button className="px-4 py-2 rounded-full text-white text-xs font-semibold" style={{ background: "#00A651" }}>{action}</button>
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
