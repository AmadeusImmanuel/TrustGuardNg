import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const STATUS_MESSAGES = {
  Funded: {
    subject: "✅ Payment Confirmed — Trade Funded",
    buyerMsg: (trade) => `Your payment of ₦${(trade.amount || 0).toLocaleString()} has been received and held in escrow for "${trade.item_name}". The seller has been notified to ship your item.\n\nTrade Reference: ${trade.reference || trade.id}`,
    sellerMsg: (trade) => `Great news! The buyer has funded the escrow for "${trade.item_name}" (₦${(trade.amount || 0).toLocaleString()}). Please ship the item and update the tracking details.\n\nTrade Reference: ${trade.reference || trade.id}`,
  },
  Shipped: {
    subject: "📦 Item Shipped — Awaiting Your Confirmation",
    buyerMsg: (trade) => `Your item "${trade.item_name}" has been dispatched${trade.tracking_code ? ` with tracking code: ${trade.tracking_code}` : ""}. Once you receive it, please confirm delivery to release payment to the seller.\n\nTrade Reference: ${trade.reference || trade.id}`,
    sellerMsg: (trade) => `You have marked "${trade.item_name}" as shipped. Funds will be released once the buyer confirms delivery or after 48 hours automatically.\n\nTrade Reference: ${trade.reference || trade.id}`,
  },
  Confirmed: {
    subject: "🎉 Delivery Confirmed — Funds Released",
    buyerMsg: (trade) => `You have confirmed receipt of "${trade.item_name}". The escrow funds have been released to the seller. Thank you for using TrustGuard!\n\nTrade Reference: ${trade.reference || trade.id}`,
    sellerMsg: (trade) => `The buyer confirmed delivery of "${trade.item_name}". ₦${(trade.amount || 0).toLocaleString()} has been credited to your wallet.\n\nTrade Reference: ${trade.reference || trade.id}`,
  },
  Disputed: {
    subject: "⚠️ Dispute Raised — Trade Under Review",
    buyerMsg: (trade) => `A dispute has been raised for trade "${trade.item_name}". Our team will review the case and contact you within 24 hours.\n\nTrade Reference: ${trade.reference || trade.id}`,
    sellerMsg: (trade) => `A dispute has been raised against your trade "${trade.item_name}". Our team will review the case and contact you within 24 hours.\n\nTrade Reference: ${trade.reference || trade.id}`,
  },
  Resolved: {
    subject: "✅ Trade Dispute Resolved",
    buyerMsg: (trade) => `The dispute for "${trade.item_name}" has been resolved by our admin team. Please check your wallet for any updates.\n\nTrade Reference: ${trade.reference || trade.id}`,
    sellerMsg: (trade) => `The dispute for "${trade.item_name}" has been resolved by our admin team. Please check your wallet for any updates.\n\nTrade Reference: ${trade.reference || trade.id}`,
  },
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { trade_id, new_status } = await req.json();

    if (!trade_id || !new_status) {
      return Response.json({ error: "trade_id and new_status required" }, { status: 400 });
    }

    const template = STATUS_MESSAGES[new_status];
    if (!template) {
      return Response.json({ sent: false, reason: "No template for status: " + new_status });
    }

    const trade = await base44.asServiceRole.entities.Trade.filter({ id: trade_id });
    const tradeData = trade[0];
    if (!tradeData) {
      return Response.json({ error: "Trade not found" }, { status: 404 });
    }

    const emails = [];

    // Notify buyer
    if (tradeData.buyer_email) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: tradeData.buyer_email,
        subject: template.subject,
        body: `Hi ${tradeData.buyer_name || "Buyer"},\n\n${template.buyerMsg(tradeData)}\n\n— TrustGuard Nigeria Team\nhttps://trustguard.ng`,
      });
      emails.push(tradeData.buyer_email);
    }

    // Notify seller
    if (tradeData.seller_email) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: tradeData.seller_email,
        subject: template.subject,
        body: `Hi ${tradeData.seller_name || "Seller"},\n\n${template.sellerMsg(tradeData)}\n\n— TrustGuard Nigeria Team\nhttps://trustguard.ng`,
      });
      emails.push(tradeData.seller_email);
    }

    return Response.json({ sent: true, notified: emails, status: new_status });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});