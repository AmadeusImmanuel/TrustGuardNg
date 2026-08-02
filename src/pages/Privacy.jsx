import React from "react";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";

const sections = [
  { title: "Information We Collect", content: "We collect information you provide directly: name, email, phone number, BVN, NIN, government ID, and bank account details for KYC verification. We also collect transactional data (trade amounts, timestamps, trade partners) and device information (IP address, browser type, device fingerprint) for security purposes." },
  { title: "How We Use Your Information", content: "Your information is used to: verify your identity and prevent fraud, process escrow transactions, resolve disputes, send transaction notifications, improve our platform, and comply with Nigerian financial regulations (CBN, NDIC, NFIU). We never use your data for advertising purposes." },
  { title: "Data Sharing", content: "We do not sell your personal data. We may share data with: Nigerian regulatory authorities when legally required, licensed banks for payment processing, identity verification partners (for NIN/BVN verification), and our cloud infrastructure providers under strict data processing agreements." },
  { title: "Data Security", content: "All personal data is encrypted using AES-256 at rest and TLS 1.3 in transit. Access to your data is restricted to authorized personnel only. We conduct regular security audits and penetration testing. In the event of a data breach, we will notify affected users within 72 hours as required by NDPR." },
  { title: "Data Retention", content: "We retain your transaction data for 7 years as required by Nigerian financial regulations. Account data is retained for 3 years after account closure. You may request deletion of non-essential data by contacting our privacy team." },
  { title: "Your Rights", content: "Under the Nigeria Data Protection Regulation (NDPR), you have the right to: access your personal data, correct inaccurate data, request deletion of your data (where legally permissible), object to processing, and lodge a complaint with NITDA. Contact privacy@trustguard.ng to exercise these rights." },
  { title: "Cookies", content: "We use essential cookies for authentication and security. We do not use tracking or advertising cookies. You can disable cookies in your browser settings, but this may affect platform functionality." },
  { title: "Contact", content: "For privacy-related inquiries, contact our Data Protection Officer at privacy@trustguard.ng or write to: Amadeus Cybernetics Limited, Data Protection Officer, Victoria Island, Lagos, Nigeria." },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <section className="pt-32 pb-16 text-primary-foreground text-center bg-brand-gradient">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-5xl font-black mb-4">Privacy Policy</h1>
          <p className="text-white/60">Last updated: January 1, 2026 · NDPR Compliant</p>
        </div>
      </section>
      <section className="py-16 bg-background">
        <div className="max-w-3xl mx-auto px-6">
          <div className="space-y-8">
            {sections.map(({ title, content }) => (
              <div key={title} className="border-b border-border pb-8">
                <h2 className="text-xl font-black text-foreground mb-3">{title}</h2>
                <p className="text-text-secondary leading-relaxed">{content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <LandingFooter />
    </div>
  );
}
