import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D1F3C]/95 backdrop-blur-md shadow-lg">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#00A651" }}>
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg">TrustGuard</span>
          <span className="text-white/40 text-sm font-light">Nigeria</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-white/70 hover:text-white text-sm transition-colors">How It Works</a>
          <a href="#calculator" className="text-white/70 hover:text-white text-sm transition-colors">Fee Calculator</a>
          <Link to="/login" className="text-white/70 hover:text-white text-sm transition-colors">Sign In</Link>
          <Link
            to="/register"
            className="px-5 py-2 rounded-full text-white font-semibold text-sm transition-all hover:opacity-90"
            style={{ background: "#00A651" }}
          >
            Get Started
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-3">
          <Link to="/login" className="text-white/80 text-sm">Login</Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded-full text-white text-sm font-medium"
            style={{ background: "#00A651" }}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}