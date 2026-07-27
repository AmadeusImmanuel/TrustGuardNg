import React from "react";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";

const sections = [
  { title: "1. Acceptance of Terms", content: "By accessing or using TrustGuard Nigeria ('the Platform'), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not use the Platform. These terms apply to all users, including buyers, sellers, and visitors." },
  { title: "2. Description of Service", content: "TrustGuard is an escrow platform that holds funds on behalf of buyers until satisfactory delivery is confirmed. We act as a neutral intermediary and do not take sides in any transaction. We are operated by Amadeus Cybernetics Limited, a company registered in Nigeria." },
  { title: "3. Escrow Process", content: "When a buyer creates a trade, they receive a virtual bank account to transfer funds. Those funds are held securely by TrustGuard until: (a) the buyer confirms delivery, (b) the agreed auto-release timer expires after shipping, or (c) an admin resolves a dispute. Funds are never released without proper authorization." },
  { title: "4. Fees", content: "TrustGuard charges a platform fee (currently 1.5%) on each successful transaction. This fee may be paid by the buyer, seller, or split between both parties, as agreed when creating the trade. Fees are non-refundable once a transaction is completed. The fee rate may be updated with 14 days notice to users." },
  { title: "5. User Obligations", content: "Users must provide accurate information during registration and KYC. You must not use TrustGuard for fraudulent, illegal, or prohibited activities. You must not create multiple accounts, use VPNs to circumvent restrictions, or attempt to manipulate the dispute resolution process. Violation of these obligations will result in immediate account suspension and potential legal action." },
  { title: "6. Dispute Resolution", content: "Either party may raise a dispute if the transaction terms are not met. TrustGuard's compliance team will review all submitted evidence and make a binding ruling within 24-48 hours. Possible outcomes include: full refund to buyer, full release to seller, or a partial split. Users agree to accept TrustGuard's ruling as final." },
  { title: "7. Prohibited Activities", content: "The following are strictly prohibited: selling illegal goods or services, money laundering, account takeover attempts, reverse payment fraud, filing false disputes, using another person's identity, and any activity that violates Nigerian law or CBN regulations." },
  { title: "8. Limitation of Liability", content: "TrustGuard's liability is limited to the transaction amount held in escrow. We are not liable for: indirect losses, loss of profit, or disputes arising from misrepresentation by either party. We make no warranty that the platform will be uninterrupted or error-free." },
  { title: "9. Privacy", content: "Your use of the platform is also governed by our Privacy Policy. We collect and process your data in accordance with Nigerian data protection law (NDPR). We never sell your personal data to third parties." },
  { title: "10. Changes to Terms", content: "We reserve the right to update these terms at any time. Users will be notified of material changes via email and in-app notification. Continued use of the platform after changes constitutes acceptance of the new terms." },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNav />
      <section className="pt-32 pb-16 text-white text-center" style={{ background: "#0D1F3C" }}>
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-5xl font-black mb-4">Terms of Service</h1>
          <p className="text-white/60">Last updated: January 1, 2026</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none"><path d="M0 40L1440 40L1440 20C1200 40 720 0 0 20L0 40Z" fill="white" /></svg>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-10">
            <p className="text-amber-800 text-sm font-semibold">Important Notice</p>
            <p className="text-amber-700 text-sm mt-1">Please read these terms carefully before using TrustGuard. By using our platform, you agree to be legally bound by these terms.</p>
          </div>
          <div className="space-y-8">
            {sections.map(({ title, content }) => (
              <div key={title} className="border-b border-gray-100 pb-8">
                <h2 className="text-xl font-black text-[#0D1F3C] mb-3">{title}</h2>
                <p className="text-gray-600 leading-relaxed">{content}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 p-6 rounded-2xl bg-gray-50 text-center">
            <p className="text-gray-500 text-sm">Questions about these terms? <a href="/contact" className="font-semibold" style={{ color: "#00A651" }}>Contact our legal team</a></p>
          </div>
        </div>
      </section>
      <LandingFooter />
    </div>
  );
}
