import React from "react";
import { Shield, Lock, Eye, AlertTriangle, Server, FileCheck, Zap, Users } from "lucide-react";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";

const TONE_CLASSES = {
  primary: "bg-primary/10 text-primary",
  info: "bg-info/10 text-info",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
};

const features = [
  { icon: Lock, title: "AES-256 Encryption", desc: "All data at rest is encrypted using AES-256, the same standard used by global banks and the US government. Your financial data is never stored in plain text.", tone: "primary" },
  { icon: Shield, title: "TLS 1.3 Security", desc: "All data in transit is protected by TLS 1.3. Every API request, every bank transaction, every login is encrypted end-to-end.", tone: "info" },
  { icon: Zap, title: "AI Fraud Detection", desc: "Our machine learning engine analyzes every transaction in real time, flagging suspicious behavior before funds are released.", tone: "primary" },
  { icon: Eye, title: "Account Monitoring", desc: "24/7 automated monitoring for unusual login patterns, device changes, and suspicious activity — with instant alerts.", tone: "danger" },
  { icon: Server, title: "Secure Infrastructure", desc: "Hosted on enterprise-grade cloud infrastructure with 99.9% uptime, automatic failover, and regular penetration testing.", tone: "primary" },
  { icon: FileCheck, title: "CBN Compliance", desc: "TrustGuard operates in full compliance with CBN regulations, NDIC guidelines, and Nigerian AML/CFT requirements.", tone: "warning" },
  { icon: Users, title: "KYC Verification", desc: "Multi-level identity verification ensures every user is who they claim to be — reducing fraud before it starts.", tone: "info" },
  { icon: AlertTriangle, title: "Dispute Protection", desc: "Every disputed transaction is frozen immediately. Funds cannot be released until our compliance team reviews all evidence.", tone: "primary" },
];

export default function Security() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <section className="pt-32 pb-20 text-primary-foreground text-center relative overflow-hidden bg-brand-gradient">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-1/4 w-96 h-96 rounded-full blur-3xl bg-primary" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-elevated bg-primary">
            <Shield className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6">Security First</h1>
          <p className="text-white/70 text-xl max-w-2xl mx-auto leading-relaxed">
            Your money and data are protected by enterprise-grade security. We take zero shortcuts when it comes to keeping you safe.
          </p>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {[
              { value: "256-bit", label: "AES Encryption" },
              { value: "TLS 1.3", label: "Data In Transit" },
              { value: "99.9%", label: "Platform Uptime" },
              { value: "24/7", label: "Active Monitoring" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center p-6 rounded-2xl border border-border bg-card-hover">
                <div className="text-3xl font-black mb-1 text-primary">{value}</div>
                <div className="text-muted text-sm">{label}</div>
              </div>
            ))}
          </div>

          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-foreground mb-4">How We Protect You</h2>
            <p className="text-muted max-w-xl mx-auto">Multiple layers of protection working together to keep your money and data safe.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map(({ icon: Icon, title, desc, tone }) => (
              <div key={title} className="flex gap-5 p-6 rounded-2xl border border-border bg-card hover:shadow-elevated transition-shadow">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${TONE_CLASSES[tone]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-2">{title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 text-primary-foreground text-center bg-brand-gradient">
        <div className="max-w-2xl mx-auto px-6">
          <Shield className="w-16 h-16 mx-auto mb-6 text-primary" />
          <h2 className="text-4xl font-black mb-4">Found a vulnerability?</h2>
          <p className="text-white/60 mb-8">We have a responsible disclosure program. If you discover a security issue, please report it to our security team before public disclosure.</p>
          <a href="mailto:security@trustguard.ng" className="inline-block px-8 py-4 rounded-full text-primary-foreground font-bold hover:opacity-90 transition-all bg-primary">
            security@trustguard.ng
          </a>
        </div>
      </section>
      <LandingFooter />
    </div>
  );
}
