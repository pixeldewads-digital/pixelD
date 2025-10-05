import { Resend } from "resend";
import { InvoiceEmail } from "@/app/emails/InvoiceEmail";
import { db } from "../db";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInvoiceEmail(orderId: string) {
  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { user: true, items: { include: { product: true } } },
    });

    if (!order || !order.user.email) {
      throw new Error("Order or user email not found.");
    }

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: order.user.email,
      subject: `PixelDew - Invoice #${order.id.slice(0, 8)}`,
      react: InvoiceEmail({ order }),
    });

    console.log(`Invoice email sent for order ${orderId}`);
  } catch (error) {
    console.error(`Failed to send invoice email for order ${orderId}:`, error);
  }
}