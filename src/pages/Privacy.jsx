import React from "react";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white font-body">
      <LandingNav />

      <section
        className="relative py-20 px-6"
        style={{
          background: "linear-gradient(135deg, #0D1F3C 0%, #0a1628 60%, #061020 100%)"
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-white/70 text-lg">Last updated: June 27, 2026</p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto prose prose-slate">
          <p className="text-gray-700 leading-relaxed mb-6">
            TrustGuard Nigeria ("TrustGuard," "we," "us," or "our") respects your privacy.
            This Privacy Policy explains what information we collect, how we use it, and
            the choices you have when you use our escrow platform (the "Service").
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: "#0D1F3C" }}>
            1. Information We Collect
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We collect information you provide directly, including:
          </p>
          <ul className="list-disc pl-6 text-gray-700 leading-relaxed mb-6 space-y-2">
            <li>Account details: full name, email address, phone number, and password.</li>
            <li>
              Identity verification (KYC) data: Bank Verification Number (BVN) and National
              Identification Number (NIN), collected only when required to verify your
              identity for withdrawals above our verification threshold.
            </li>
            <li>Transaction data: trade details, amounts, payment references, and trade history.</li>
            <li>
              Communications: messages you send us, dispute details, and support requests.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: "#0D1F3C" }}>
            2. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 text-gray-700 leading-relaxed mb-6 space-y-2">
            <li>To create and manage your account.</li>
            <li>To facilitate escrow transactions between buyers and sellers.</li>
            <li>To verify your identity and comply with anti-fraud and KYC obligations.</li>
            <li>To process payments, withdrawals, and refunds.</li>
            <li>To investigate and resolve disputes.</li>
            <li>To send you transactional notifications (email, SMS, WhatsApp) about your trades.</li>
            <li>To improve and secure the Service.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: "#0D1F3C" }}>
            3. How We Share Your Information
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We do not sell your personal information. We may share information with:
          </p>
          <ul className="list-disc pl-6 text-gray-700 leading-relaxed mb-6 space-y-2">
            <li>Payment processors (such as Paystack) to process payments and withdrawals.</li>
            <li>
              Identity verification providers to confirm BVN/NIN details where legally
              required.
            </li>
            <li>
              The other party in a trade, limited to information necessary to complete that
              specific transaction (such as a name or delivery confirmation).
            </li>
            <li>Law enforcement or regulators, where required by Nigerian law.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: "#0D1F3C" }}>
            4. Data Security
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            We use industry-standard measures, including encrypted connections and secure
            password storage, to protect your information. However, no system is completely
            secure, and we encourage you to use a strong, unique password and to never share
            your login credentials with anyone — TrustGuard staff will never ask for your
            password.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: "#0D1F3C" }}>
            5. Data Retention
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            We retain your information for as long as your account is active, and for a
            reasonable period afterward to comply with legal, accounting, or dispute
            resolution requirements.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: "#0D1F3C" }}>
            6. Your Rights
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            You may request access to, correction of, or deletion of your personal
            information, subject to our legal and regulatory obligations (for example, we
            may need to retain transaction records for a minimum period). To make a request,
            contact us using the details below.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: "#0D1F3C" }}>
            7. Changes to This Policy
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            We may update this Privacy Policy from time to time. We will notify you of
            material changes by posting the updated policy on this page with a new
            "Last updated" date.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: "#0D1F3C" }}>
            8. Contact Us
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            If you have questions about this Privacy Policy, contact us at{" "}
            <a
              href="mailto:support@trustguardng.com"
              className="font-semibold hover:underline"
              style={{ color: "#00A651" }}
            >
              support@trustguardng.com
            </a>
            .
          </p>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
