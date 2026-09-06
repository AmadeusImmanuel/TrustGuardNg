// Single source of truth for all escrow service categories — used by both
// the landing page service cards and the dedicated /services/:slug pages,
// so copy only needs to be maintained in one place.
const services = [
  {
    slug: "electronics",
    emoji: "📱",
    title: "Electronics Escrow",
    desc: "Phones, laptops, gadgets",
    intro: "Buying or selling a phone, laptop, or gadget from a stranger online? TrustGuard holds the payment until you've confirmed the item is exactly as described.",
    howItWorks: [
      "Buyer creates a trade with the item details and agreed price.",
      "Seller accepts and receives a virtual account to be funded.",
      "Buyer transfers the money into escrow — the seller is notified immediately.",
      "Seller ships the item and adds tracking details.",
      "Buyer inspects the item and confirms delivery — funds release to the seller automatically.",
    ],
    protections: [
      "Money is held in escrow, not sent directly to the seller, until you confirm the item is correct.",
      "If the device doesn't match the listing (wrong model, damaged, blacklisted IMEI), you can raise a dispute before confirming.",
      "Sellers are protected too — once you confirm delivery, funds release immediately with no chargebacks.",
    ],
    faqs: [
      { q: "What if the phone turns out to be stolen or blacklisted?", a: "Raise a dispute before confirming delivery. Our team reviews evidence (IMEI checks, photos, seller communication) and can issue a refund." },
      { q: "Can I test the device before releasing funds?", a: "Yes — confirm delivery only after you've checked the item. Funds don't release automatically until you approve, unless the auto-release timer expires." },
      { q: "Who pays the escrow fee?", a: "You choose at trade creation — buyer, seller, or split 50/50." },
    ],
  },
  {
    slug: "vehicles",
    emoji: "🚗",
    title: "Vehicle Escrow",
    desc: "Cars, bikes, spare parts",
    intro: "Vehicle purchases involve real money and real risk. TrustGuard escrow protects both sides of a car, motorcycle, or spare parts deal.",
    howItWorks: [
      "Buyer and seller agree on the vehicle, price, and inspection terms, then create the trade.",
      "Seller accepts and the buyer funds escrow.",
      "Buyer inspects the vehicle (in person or via an agreed inspection service) before confirming.",
      "Once satisfied, buyer confirms and funds release to the seller.",
    ],
    protections: [
      "Funds stay in escrow until the buyer has physically inspected and accepted the vehicle.",
      "Disputes over vehicle condition, papers, or ownership can be raised with evidence before release.",
      "Reference numbers and trade timelines give both parties a clear paper trail for high-value deals.",
    ],
    faqs: [
      { q: "Does TrustGuard verify vehicle documents?", a: "TrustGuard escrows the payment; it does not verify vehicle particulars or ownership papers. We recommend independent verification before confirming delivery." },
      { q: "What if the vehicle has issues not disclosed by the seller?", a: "Raise a dispute with photos/evidence before confirming. Our team reviews and can rule a refund, release, or split." },
      { q: "Is there a minimum trade amount?", a: "No minimum, but for large vehicle transactions we recommend an in-person inspection before confirming delivery." },
    ],
  },
  {
    slug: "real-estate",
    emoji: "🏠",
    title: "Real Estate Escrow",
    desc: "Rent deposits, land deals",
    intro: "Rent deposits and land transactions are common targets for fraud in Nigeria. TrustGuard holds funds until the agreed terms are actually met.",
    howItWorks: [
      "Landlord/seller and tenant/buyer agree on terms and create a trade for the deposit or payment.",
      "The paying party funds escrow — the money does not go directly to the other party.",
      "Agreed conditions are met (keys handed over, documents verified, property inspected).",
      "The paying party confirms and funds release.",
    ],
    protections: [
      "Deposits and payments are not released until the agreed condition (keys, documents, access) is confirmed.",
      "Disputes over property condition or paperwork can be raised with evidence before release.",
      "A documented trade reference gives both parties a record of what was agreed and paid.",
    ],
    faqs: [
      { q: "Does TrustGuard verify land titles or C of O?", a: "No — TrustGuard escrows the payment only. We strongly recommend independent legal verification of documents before confirming any real estate trade." },
      { q: "Can I use this for full property purchases, not just deposits?", a: "Yes, though for large sums we recommend involving a lawyer alongside the escrow protection." },
      { q: "What happens if the landlord doesn't hand over keys after payment?", a: "Don't confirm delivery. Raise a dispute — funds stay in escrow until resolved." },
    ],
  },
  {
    slug: "building-materials",
    emoji: "🧱",
    title: "Building Materials Escrow",
    desc: "Cement, tiles, iron rods",
    intro: "Bulk building material orders often mean paying upfront before delivery. Escrow protects that payment until the materials actually arrive.",
    howItWorks: [
      "Buyer creates a trade specifying materials, quantity, and price.",
      "Supplier accepts and buyer funds escrow.",
      "Supplier arranges delivery and provides dispatch/tracking details.",
      "Buyer confirms materials received in the right quantity and quality — funds release.",
    ],
    protections: [
      "Payment isn't released until delivery is confirmed, protecting against non-delivery or short-supply.",
      "Disputes over quantity, quality, or damaged materials can be raised with photo evidence.",
      "Suppliers are protected once delivery is confirmed — no delayed or partial payments.",
    ],
    faqs: [
      { q: "What if only part of the order arrives?", a: "Raise a dispute describing the shortfall with evidence — our team can rule a partial release." },
      { q: "Can this be used for recurring bulk orders?", a: "Yes, create a new trade for each order — each is tracked and protected independently." },
      { q: "Who arranges delivery/logistics?", a: "The supplier does, same as any direct sale — TrustGuard escrows the payment, not the logistics." },
    ],
  },
  {
    slug: "freelancing",
    emoji: "💻",
    title: "Freelancing Escrow",
    desc: "Design, writing, coding",
    intro: "Freelance work often runs into payment disputes on both sides. TrustGuard escrow protects clients from non-delivery and freelancers from non-payment.",
    howItWorks: [
      "Client and freelancer agree on scope and price, then create a trade.",
      "Freelancer accepts and the client funds escrow upfront.",
      "Freelancer delivers the work.",
      "Client reviews the deliverable and confirms — funds release to the freelancer.",
    ],
    protections: [
      "Freelancers know the money is already secured before they start work.",
      "Clients don't release payment until the delivered work matches what was agreed.",
      "Scope or quality disagreements can be raised as a dispute with evidence instead of an unresolved back-and-forth.",
    ],
    faqs: [
      { q: "What if the freelancer delivers late?", a: "Late delivery on its own isn't grounds for a dispute unless a deadline was part of the agreed terms — raise a dispute if delivery doesn't happen at all or doesn't match scope." },
      { q: "Can I release partial payment for partial work?", a: "Create separate trades for milestones if you want partial releases — a single trade releases in full on confirmation." },
      { q: "What if I'm not happy with the quality?", a: "Raise a dispute with specifics on what doesn't match the agreed scope. Our team reviews evidence from both sides." },
    ],
  },
  {
    slug: "digital-services",
    emoji: "🎯",
    title: "Digital Services Escrow",
    desc: "Software, courses, data",
    intro: "Digital goods and services — software licenses, online courses, data bundles — carry real fraud risk since delivery is instant and hard to reverse. Escrow adds a checkpoint.",
    howItWorks: [
      "Buyer creates a trade specifying the digital product or service and price.",
      "Seller accepts and buyer funds escrow.",
      "Seller delivers access, license, or file.",
      "Buyer verifies it works as described and confirms — funds release.",
    ],
    protections: [
      "Payment isn't released until the buyer confirms the digital product actually works as promised.",
      "Protects against common digital-goods scams like fake licenses or non-working access.",
      "Sellers are protected from chargebacks once delivery is confirmed.",
    ],
    faqs: [
      { q: "What if the software license doesn't activate?", a: "Don't confirm — raise a dispute with evidence (error screenshots, activation attempts)." },
      { q: "Does this work for subscription-based digital services?", a: "Best suited to one-time deliverables. For subscriptions, consider a trade per billing cycle." },
      { q: "Can refunds be partial?", a: "Yes — admin can rule a split refund on a dispute if only part of the service was delivered." },
    ],
  },
  {
    slug: "import-export",
    emoji: "🌍",
    title: "Import & Export Escrow",
    desc: "International trade",
    intro: "Cross-border trade adds distance, currency, and logistics risk on top of the usual trust problem. Escrow gives both sides a neutral holding point for the payment.",
    howItWorks: [
      "Importer and exporter agree terms and create a trade for the shipment value.",
      "Exporter accepts and the importer funds escrow.",
      "Exporter ships and provides tracking/customs documentation.",
      "Importer confirms goods received in agreed condition — funds release.",
    ],
    protections: [
      "Payment is held until goods are confirmed received, reducing risk on both sides of an international deal.",
      "Shipment and customs delays are visible via tracking details attached to the trade.",
      "Disputes over quantity, quality, or customs issues can be raised with documentation before release.",
    ],
    faqs: [
      { q: "Does TrustGuard handle customs or shipping?", a: "No — TrustGuard escrows the payment only. Logistics, customs clearance, and shipping remain between the two parties." },
      { q: "What currency is used?", a: "Trades are processed in Naira (NGN) via Paystack. For international deals, agree the NGN-equivalent amount upfront." },
      { q: "What if goods are held at customs?", a: "Don't confirm until goods are actually received — the auto-release timer can be extended by contacting support if there's a documented delay." },
    ],
  },
  {
    slug: "agriculture",
    emoji: "🌾",
    title: "Agriculture Escrow",
    desc: "Crops, livestock, feeds",
    intro: "Agricultural trade — crops, livestock, feed — often means paying before harvest or delivery. Escrow protects that upfront payment.",
    howItWorks: [
      "Buyer and farmer/supplier agree on produce, quantity, and price, then create a trade.",
      "Supplier accepts and buyer funds escrow.",
      "Supplier delivers the produce or livestock.",
      "Buyer confirms quality and quantity — funds release.",
    ],
    protections: [
      "Payment isn't released until delivery and quality are confirmed, protecting against non-delivery or poor quality.",
      "Disputes over spoilage, short quantity, or livestock health can be raised with evidence.",
      "Suppliers are guaranteed payment once the buyer confirms — no chasing for payment after delivery.",
    ],
    faqs: [
      { q: "What if produce arrives spoiled?", a: "Raise a dispute with photo evidence before confirming — our team can rule a refund or partial release." },
      { q: "Can this be used for seasonal/advance crop purchases?", a: "Yes, though for pre-harvest advance payments, agree clear delivery timelines as part of the trade terms." },
      { q: "Is livestock health verified by TrustGuard?", a: "No — TrustGuard escrows payment only. Buyers should arrange their own inspection before confirming." },
    ],
  },
  {
    slug: "wholesale",
    emoji: "📦",
    title: "Wholesale Escrow",
    desc: "Bulk goods, distributors",
    intro: "Bulk and wholesale orders involve larger sums and more room for things to go wrong. Escrow protects both the buyer's payment and the distributor's delivery.",
    howItWorks: [
      "Buyer creates a trade with the bulk order details and total price.",
      "Distributor accepts and buyer funds escrow.",
      "Distributor fulfills and ships the order.",
      "Buyer confirms the full order was received correctly — funds release.",
    ],
    protections: [
      "Large sums stay protected in escrow rather than being wired directly before goods arrive.",
      "Short-shipment or wrong-item disputes can be raised with evidence before release.",
      "Distributors are guaranteed payment once the buyer confirms, avoiding chasing invoices after delivery.",
    ],
    faqs: [
      { q: "Is there a maximum trade amount?", a: "No hard maximum, though very large trades should have KYC completed first for smooth withdrawal." },
      { q: "Can I split a large order into multiple trades?", a: "Yes — some buyers create one trade per shipment/batch for easier tracking." },
      { q: "What if the distributor sends the wrong SKU/items?", a: "Raise a dispute with photos before confirming — don't confirm delivery on an incorrect order." },
    ],
  },
  {
    slug: "marketplace",
    emoji: "🛒",
    title: "Marketplace Escrow",
    desc: "Jiji, Instagram, WhatsApp",
    intro: "Most Nigerian online trade happens through Jiji, Instagram, and WhatsApp — with no built-in payment protection. TrustGuard adds that missing layer to any deal made on these platforms.",
    howItWorks: [
      "Agree on the item and price with the seller as usual, wherever the deal originated.",
      "Create a TrustGuard trade with those details instead of paying the seller directly.",
      "Seller accepts and you fund the TrustGuard escrow — not the seller's account.",
      "Seller ships or delivers, you confirm, and funds release.",
    ],
    protections: [
      "Removes the single biggest risk of social-media trading: sending money to someone who disappears.",
      "Works alongside any platform — Jiji, Instagram, WhatsApp, Facebook Marketplace — since the escrow happens on TrustGuard, not the originating app.",
      "Full dispute process available if the item never arrives or doesn't match what was listed.",
    ],
    faqs: [
      { q: "Do I need the seller to already have a TrustGuard account?", a: "No — invite them by email when creating the trade. They'll be prompted to accept and can register if needed." },
      { q: "Does this work for in-person meetups too?", a: "Yes — fund escrow before meeting, confirm on the spot once you've checked the item, and funds release immediately." },
      { q: "What if the seller refuses to use TrustGuard?", a: "That's a red flag worth taking seriously on a stranger transaction — legitimate sellers generally have no issue with buyer protection." },
    ],
  },
  {
    slug: "contracts",
    emoji: "📋",
    title: "Contract Escrow",
    desc: "Business agreements",
    intro: "Business agreements and service contracts often involve staged payments tied to milestones. Escrow makes sure funds only move when agreed conditions are actually met.",
    howItWorks: [
      "Both parties agree on the contract terms and the amount tied to a milestone or deliverable.",
      "The paying party creates a trade and the receiving party accepts.",
      "Funds are placed in escrow for that milestone.",
      "Once the deliverable is confirmed complete, funds release.",
    ],
    protections: [
      "Milestone payments are protected on both sides — no upfront payment risk, no unpaid-delivery risk.",
      "A documented trade record supports each stage of a longer business relationship.",
      "Contract disputes can be raised with evidence tied to the specific milestone in question.",
    ],
    faqs: [
      { q: "Can I use one trade for a whole multi-stage contract?", a: "We recommend creating a separate trade per milestone so each stage is tracked and released independently." },
      { q: "Is this a substitute for a signed contract?", a: "No — TrustGuard escrows payment; it doesn't replace a proper written agreement between the parties." },
      { q: "What if a milestone is disputed?", a: "Raise a dispute for that specific trade with the relevant evidence — other milestones/trades are unaffected." },
    ],
  },
  {
    slug: "fashion",
    emoji: "👗",
    title: "Fashion Escrow",
    desc: "Clothing, shoes, bags",
    intro: "Fashion resale — clothing, shoes, bags — is one of the most common categories for online scams in Nigeria. Escrow protects the payment until you've seen the real item.",
    howItWorks: [
      "Buyer creates a trade with the item and agreed price.",
      "Seller accepts and buyer funds escrow.",
      "Seller ships the item.",
      "Buyer inspects on arrival and confirms — funds release to the seller.",
    ],
    protections: [
      "Protects against items that don't match photos — wrong size, fake designer goods, damaged items.",
      "Payment isn't released until you've physically checked the item.",
      "Sellers are protected too — once confirmed, payment is final and immediate.",
    ],
    faqs: [
      { q: "What if the item is a counterfeit sold as authentic?", a: "Raise a dispute with evidence (comparison photos, authentication if available) before confirming." },
      { q: "What if the size doesn't fit?", a: "Sizing issues alone aren't fraud, but if the listed size was wrong, raise a dispute with the listing as evidence." },
      { q: "Can I use this for pre-owned/thrift items?", a: "Yes — works the same way regardless of whether items are new or pre-owned." },
    ],
  },
];

export function getServiceBySlug(slug) {
  return services.find((s) => s.slug === slug) || null;
}

export default services;
