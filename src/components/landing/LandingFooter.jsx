import React from "react";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer style={{ background: "#0D1F3C" }} className="text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#00A651" }}>
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">TrustGuard Nigeria</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Nigeria's most secure escrow platform. Built for social commerce, designed for trust.
              Zero card failures. Zero fraud.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white/80">Platform</h4>
            <ul className="space-y-2.5 text-white/50 text-sm">
              <li><Link to="/register" className="hover:text-white transition-colors">Get Started</Link></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#calculator" className="hover:text-white transition-colors">Fee Calculator</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white/80">Legal</h4>
            <ul className="space-y-2.5 text-white/50 text-sm">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs">© 2026 TrustGuard Nigeria. All rights reserved.</p>
          <p className="text-white/40 text-xs">Secured by bank-grade encryption. CBN compliant.</p>
        </div>
      </div>
    </footer>
  );
}