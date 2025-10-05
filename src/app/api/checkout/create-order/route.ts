import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth.config";
import { db } from "@/lib/db";
import { CartItem } from "@/lib/store/cart";
import { generateIdempotencyKey } from "@/lib/idempotency";
import { createStripeCheckoutSession } from "@/lib/payments/stripe";
import { createMidtransTransaction } from "@/lib/payments/midtrans";
import { createXenditInvoice } from "@/lib/payments/xendit";
import { PaymentProvider } from "@prisma/client";

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { cart, coupon } = (await req.json()) as {
    cart: CartItem[];
    coupon?: string;
  };

  if (!cart || cart.length === 0) {
    return new NextResponse("Bad Request: Cart is empty", { status: 400 });
  }

  // Idempotency Check
  const idempotencyKey = generateIdempotencyKey(cart, userId);
  const existingOrder = await db.order.findFirst({ where: { idempotencyKey } });
  if (existingOrder) {
    // If order exists, redirect to a generic success/status page to avoid duplicate payments
    return NextResponse.json({ redirectUrl: `/success?order_id=${existingOrder.id}` });
  }

  const productIds = cart.map((item) => item.id);
  const dbProducts = await db.product.findMany({
    where: { id: { in: productIds }, status: "PUBLISHED" },
  });

  let totalCents = 0;
  const orderItemsData = [];

  for (const cartItem of cart) {
    const dbProduct = dbProducts.find((p) => p.id === cartItem.id);
    if (!dbProduct) {
      return new NextResponse(`Bad Request: Product ${cartItem.id} not available.`, { status: 400 });
    }
    totalCents += dbProduct.priceCents * cartItem.quantity;
    orderItemsData.push({
      productId: dbProduct.id,
      quantity: cartItem.quantity,
      priceCents: dbProduct.priceCents,
    });
  }

  // Coupon Logic
  if (coupon) {
    const dbCoupon = await db.coupon.findUnique({
      where: { code: coupon, active: true },
    });
    if (dbCoupon) {
      if (dbCoupon.percentOff) {
        totalCents = Math.round(totalCents * ((100 - dbCoupon.percentOff) / 100));
      } else if (dbCoupon.amountOff) {
        totalCents = Math.max(0, totalCents - dbCoupon.amountOff);
      }
    }
  }

  // Create Order with PENDING status
  const order = await db.order.create({
    data: {
      userId,
      totalCents,
      paymentStatus: "PENDING",
      provider: (process.env.PAYMENT_PROVIDER?.toUpperCase() as PaymentProvider) || "STRIPE",
      couponCode: coupon,
      idempotencyKey,
      items: { create: orderItemsData },
    },
  });

  // Payment Provider Logic
  try {
    let redirectUrl: string | null = null;
    let providerRef: string | null = null;

    switch (order.provider) {
      case "STRIPE":
        const stripeSession = await createStripeCheckoutSession(order, cart);
        redirectUrl = stripeSession.url;
        providerRef = stripeSession.id;
        break;
      case "MIDTRANS":
        const midtransTx = await createMidtransTransaction(order, cart);
        redirectUrl = midtransTx.redirect_url;
        providerRef = midtransTx.token;
        break;
      case "XENDIT":
        const xenditInvoice = await createXenditInvoice(order, cart);
        redirectUrl = xenditInvoice.invoice_url;
        providerRef = xenditInvoice.invoice_url; // Or a specific ID if available
        break;
      default:
        throw new Error("Unsupported payment provider");
    }

    if (!redirectUrl) {
      throw new Error("Failed to create payment session URL.");
    }

    // Store the provider reference
    await db.order.update({
      where: { id: order.id },
      data: { providerRef },
    });

    return NextResponse.json({ redirectUrl });

  } catch (error) {
    console.error("Failed to create payment session:", error);
    // Attempt to roll back the order creation or mark it as failed
    await db.order.update({ where: { id: order.id }, data: { paymentStatus: "FAILED" } });
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}