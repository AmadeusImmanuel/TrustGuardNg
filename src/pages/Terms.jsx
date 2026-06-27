import React from "react";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";

export default function Terms() {
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
            Terms of Service
          </h1>
          <p className="text-white/70 text-lg">Last updated: June 27, 2026</p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto prose prose-slate">
          <p className="text-gray-700 leading-relaxed mb-6">
            These Terms of Service ("Terms") govern your use of TrustGuard Nigeria's
            escrow platform (the "Service"), operated by Amadeus Cybernetics Limited
            ("TrustGuard," "we," "us," or "our"). By creating an account or using the
            Service, you agree to these Terms.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: "#0D1F3C" }}>
            1. The Service
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            TrustGuard provides an escrow service that holds payment from a buyer until
            the buyer confirms satisfactory delivery of goods or services from a seller, at
            which point funds are released to the seller. TrustGuard is not a party to the
            underlying transaction between buyer and seller and does not guarantee the
            quality, legality, or delivery of any goods or services exchanged.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: "#0D1F3C" }}>
            2. Eligibility and Account Registration
          </h2>
          <ul className="list-disc pl-6 text-gray-700 leading-relaxed mb-6 space-y-2">
            <li>You must be at least 18 years old to use the Service.</li>
            <li>
              You must provide accurate, current information when registering and keep
              your account information up to date.
            </li>
            <li>
              You are responsible for maintaining the confidentiality of your password and
              for all activity under your account.
            </li>
            <li>
              Withdrawals above our stated threshold require identity verification (KYC)
              using your BVN and/or NIN.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: "#0D1F3C" }}>
            3. Trades and Escrow
          </h2>
          <ul className="list-disc pl-6 text-gray-700 leading-relaxed mb-6 space-y-2">
            <li>
              When a buyer funds a trade, TrustGuard holds the funds in escrow until the
              trade is marked complete, automatically released after the stated auto-release
              period, or resolved through our dispute process.
            </li>
            <li>
              Sellers should only ship or deliver goods/services after a trade shows as
              funded on the platform.
            </li>
            <li>
              A service fee, as shown in our fee calculator at the time of trade creation,
              is deducted from the transaction.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: "#0D1F3C" }}>
            4. Disputes
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            If a buyer and seller disagree about a trade, either party may open a dispute
            before funds are released. TrustGuard will review evidence submitted by both
            parties and make a determination in good faith. TrustGuard's decision on a
            dispute is final with respect to the release of escrowed funds.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: "#0D1F3C" }}>
            5. Prohibited Use
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">You agree not to:</p>
          <ul className="list-disc pl-6 text-gray-700 leading-relaxed mb-6 space-y-2">
            <li>Use the Service for any illegal purpose, including fraud or money laundering.</li>
            <li>Provide false identity or verification information.</li>
            <li>Attempt to circumvent the escrow process to avoid fees or dispute protections.</li>
            <li>Interfere with or disrupt the Service or its infrastructure.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: "#0D1F3C" }}>
            6. Fees
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            TrustGuard charges a service fee on completed trades, as disclosed before you
            confirm a trade. We may update our fee schedule from time to time; the
            applicable fee is the one shown at the time a trade is created.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: "#0D1F3C" }}>
            7. Limitation of Liability
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            TrustGuard provides the escrow infrastructure but is not responsible for the
            quality, safety, or legality of items or services exchanged between users. To
            the maximum extent permitted by law, TrustGuard's liability for any claim
            arising from your use of the Service is limited to the amount of fees you paid
            us in the transaction giving rise to the claim.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: "#0D1F3C" }}>
            8. Account Suspension and Termination
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            We may suspend or terminate your account if we reasonably believe you have
            violated these Terms, engaged in fraudulent activity, or posed a risk to other
            users or to TrustGuard.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: "#0D1F3C" }}>
            9. Governing Law
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            These Terms are governed by the laws of the Federal Republic of Nigeria.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: "#0D1F3C" }}>
            10. Changes to These Terms
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            We may update these Terms from time to time. Continued use of the Service after
            changes take effect constitutes acceptance of the revised Terms.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: "#0D1F3C" }}>
            11. Contact Us
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Questions about these Terms can be sent to{" "}
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
