import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth.config";
import { db } from "@/lib/db";
import { generateInvoicePdf } from "@/lib/pdf/invoice";

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { orderId } = params;

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    return new NextResponse("Not Found: Order not found.", { status: 404 });
  }

  if (order.userId !== userId) {
    return new NextResponse("Forbidden: You do not own this order.", { status: 403 });
  }

  try {
    const pdfBytes = await generateInvoicePdf(order);

    const headers = new Headers();
    headers.append("Content-Type", "application/pdf");
    headers.append(
      "Content-Disposition",
      `attachment; filename="invoice-${order.id.slice(0, 8)}.pdf"`
    );

    return new NextResponse(pdfBytes, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error(`Failed to generate PDF for order ${orderId}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}