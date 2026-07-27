import React from "react";
import { Link } from "react-router-dom";
import { Shield, Twitter, Instagram, Facebook, Linkedin, Mail, Phone } from "lucide-react";

const links = {
  Platform: [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Fee Calculator", href: "#calculator" },
    { label: "Track Transaction", href: "#tracker" },
    { label: "Services", href: "#services" },
  ],
  Company: [
    { label: "About Us", to: "/about" },
    { label: "Blog", to: "/blog" },
    { label: "Careers", to: "/careers" },
    { label: "Partners", to: "/partners" },
  ],
  Support: [
    { label: "Help Center", to: "/help" },
    { label: "Contact Us", to: "/contact" },
    { label: "Report Fraud", to: "/report" },
    { label: "API Docs", to: "/api-docs" },
  ],
  Legal: [
    { label: "Terms of Service", to: "/terms" },
    { label: "Privacy Policy", to: "/privacy" },
    { label: "AML Policy", to: "/aml" },
    { label: "Dispute Policy", to: "/disputes-policy" },
  ],
};

export default function LandingFooter() {
  return (
    <footer style={{ background: "#0D1F3C" }} className="text-white pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-10 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#00A651" }}>
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-lg">TrustGuard</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Nigeria's most secure escrow platform. Built to eliminate fraud in online trade.
            </p>
            <div className="flex gap-3">
              {[Twitter, Instagram, Facebook, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                  <Icon className="w-4 h-4 text-white/60" />
                </a>
              ))}
            </div>
          </div>
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-bold text-sm mb-4 text-white/80">{category}</h4>
              <ul className="space-y-2.5">
                {items.map(({ label, href, to }) => (
                  <li key={label}>
                    {to ? (
                      <Link to={to} className="text-white/50 hover:text-white text-sm transition-colors">{label}</Link>
                    ) : (
                      <a href={href} className="text-white/50 hover:text-white text-sm transition-colors">{label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6 text-white/40 text-xs">
              <span>© 2026 TrustGuard Nigeria — Amadeus Cybernetics Limited</span>
            </div>
            <div className="flex items-center gap-4 text-white/40 text-xs">
              <div className="flex items-center gap-1"><Mail className="w-3 h-3" /> support@trustguard.ng</div>
              <div className="flex items-center gap-1"><Phone className="w-3 h-3" /> +234 800 TRUST</div>
              <span>🔒 SSL Secured</span>
              <span>🇳🇬 CBN Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
