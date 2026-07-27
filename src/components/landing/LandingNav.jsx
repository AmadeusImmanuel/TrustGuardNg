import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Services", href: "#services" },
  { label: "Fee Calculator", href: "#calculator" },
  { label: "Track Transaction", href: "#tracker" },
];

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0D1F3C]/98 shadow-xl backdrop-blur-md" : "bg-[#0D1F3C]/80 backdrop-blur-sm"}`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg" style={{ background: "#00A651" }}>
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-black text-lg">TrustGuard</span>
            <span className="hidden sm:block text-white/40 text-sm font-light">Nigeria</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <a key={label} href={href} className="text-white/70 hover:text-white text-sm transition-colors font-medium">{label}</a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-white/70 hover:text-white text-sm transition-colors font-medium">Sign In</Link>
            <Link to="/register" className="px-5 py-2 rounded-full text-white font-semibold text-sm transition-all hover:opacity-90 hover:scale-105 shadow-lg"
              style={{ background: "linear-gradient(135deg, #00A651, #00c860)" }}>
              Get Started Free
            </Link>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white p-1">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 px-6 py-4 space-y-3" style={{ background: "#0D1F3C" }}>
            {NAV_LINKS.map(({ label, href }) => (
              <a key={label} href={href} onClick={() => setMobileOpen(false)}
                className="block text-white/70 hover:text-white text-sm py-2 font-medium">{label}</a>
            ))}
            <div className="pt-3 border-t border-white/10 flex gap-3">
              <Link to="/login" className="flex-1 text-center py-2.5 rounded-full border border-white/30 text-white text-sm font-medium">Sign In</Link>
              <Link to="/register" className="flex-1 text-center py-2.5 rounded-full text-white text-sm font-semibold"
                style={{ background: "#00A651" }}>Get Started</Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
