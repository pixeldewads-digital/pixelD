import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/payments/stripe";
import { db } from "@/lib/db";
import { sendInvoiceEmail } from "@/lib/email/resend";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("Stripe webhook secret is not set.");
    return new NextResponse("Internal Server Error: Webhook secret not configured", { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const orderId = session?.metadata?.orderId;

    if (!orderId) {
      console.error("Webhook received without orderId in metadata");
      return new NextResponse("Bad Request: Missing orderId in metadata", { status: 400 });
    }

    try {
      await db.order.update({
        where: { id: orderId },
        data: { paymentStatus: "PAID" },
      });

      // Send invoice email after successful payment
      await sendInvoiceEmail(orderId);

    } catch (error) {
      console.error(`Failed to update order ${orderId} to PAID`, error);
      // Don't fail the webhook, as Stripe will retry. Log the error for investigation.
    }
  } else {
    console.log(`Unhandled event type: ${event.type}`);
  }

  return new NextResponse(null, { status: 200 });
}