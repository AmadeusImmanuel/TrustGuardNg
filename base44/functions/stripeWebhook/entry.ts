import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import Stripe from 'npm:stripe';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));
    const signature = req.headers.get("stripe-signature");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!signature || !webhookSecret) {
      console.error("Missing stripe-signature or webhook secret");
      return Response.json({ error: "Missing signature" }, { status: 400 });
    }

    const body = await req.text();
    let event;

    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      console.error("Signature verification failed:", err.message);
      return Response.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const tradeId = session.metadata?.trade_id;
      const tradeRef = session.metadata?.trade_reference;

      if (!tradeId) {
        console.error("No trade_id in session metadata");
        return Response.json({ received: true });
      }

      // Log the webhook event
      await base44.asServiceRole.entities.WebhookEvent.create({
        gateway: "Stripe",
        trade_id: tradeId,
        trade_reference: tradeRef,
        amount: (session.amount_total || 0) / 100,
        event_type: "checkout.session.completed",
        status: "success",
        raw_payload: JSON.stringify(session),
      });

      // Update trade to Funded
      const trades = await base44.asServiceRole.entities.Trade.filter({ id: tradeId });
      const trade = trades[0];
      if (trade && trade.status === "Awaiting_Payment") {
        const now = new Date().toISOString();
        await base44.asServiceRole.entities.Trade.update(tradeId, {
          status: "Funded",
          funded_at: now,
        });

        // Update the pending transaction to completed
        const txns = await base44.asServiceRole.entities.Transaction.filter({
          trade_id: tradeId,
          type: "Escrow_Inflow",
          status: "pending",
        });
        if (txns.length > 0) {
          await base44.asServiceRole.entities.Transaction.update(txns[0].id, {
            status: "completed",
          });
        }

        console.log(`Trade ${tradeRef} marked as Funded via Stripe webhook`);
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});