import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import Stripe from 'npm:stripe';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

    const { trade_id } = await req.json();
    if (!trade_id) {
      return Response.json({ error: "trade_id required" }, { status: 400 });
    }

    // Fetch trade
    const trades = await base44.asServiceRole.entities.Trade.filter({ id: trade_id });
    const trade = trades[0];
    if (!trade) {
      return Response.json({ error: "Trade not found" }, { status: 404 });
    }

    if (trade.status !== "Awaiting_Payment" && trade.status !== "Draft") {
      return Response.json({ error: "Trade is not awaiting payment" }, { status: 400 });
    }

    // Calculate the amount (buyer pays)
    const feePayer = trade.fee_payer || "BUYER";
    const fee = (trade.amount || 0) * 0.015;
    const buyerTotal = feePayer === "BUYER"
      ? trade.amount + fee
      : feePayer === "SPLIT_50_50"
        ? trade.amount + fee / 2
        : trade.amount;

    const amountInKobo = Math.round(buyerTotal * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "ngn",
          product: "prod_UiZiHB0Y41Vcur",
          unit_amount: amountInKobo,
        },
        quantity: 1,
      }],
      metadata: {
        trade_id: trade.id,
        trade_reference: trade.reference,
        base44_app_id: Deno.env.get("BASE44_APP_ID"),
      },
      success_url: `${req.headers.get("origin")}/trades/${trade.id}?payment=success`,
      cancel_url: `${req.headers.get("origin")}/trades/${trade.id}?payment=cancelled`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});