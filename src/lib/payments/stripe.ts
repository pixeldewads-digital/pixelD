import Stripe from "stripe";
import { Order } from "@prisma/client";
import { CartItem } from "../store/cart";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
});

export async function createStripeCheckoutSession(
  order: Order,
  cart: CartItem[]
) {
  const line_items = cart.map((item) => ({
    price_data: {
      currency: "IDR",
      product_data: {
        name: item.title,
        images: [item.coverImageUrl],
      },
      unit_amount: item.priceCents,
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: `${process.env.NEXTAUTH_URL}/success?order_id=${order.id}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
    metadata: {
      orderId: order.id,
      userId: order.userId,
    },
  });

  return session;
}