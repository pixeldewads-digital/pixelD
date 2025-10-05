import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth.config";
import { db } from "@/lib/db";
import { getSignedDownloadUrl } from "@/lib/storage/s3";

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { orderItemId } = await req.json();
  if (!orderItemId) {
    return new NextResponse("Bad Request: Missing orderItemId", { status: 400 });
  }

  const item = await db.orderItem.findUnique({
    where: { id: orderItemId },
    include: { order: true, product: true },
  });

  // 1. Validate Ownership
  if (!item || item.order.userId !== userId) {
    return new NextResponse("Forbidden: You do not own this item.", { status: 403 });
  }

  // 2. Validate Payment Status
  if (item.order.paymentStatus !== "PAID") {
    return new NextResponse("Forbidden: Payment has not been completed.", { status: 403 });
  }

  // 3. Validate Download Limits
  const maxAttempts = parseInt(process.env.DOWNLOAD_MAX_ATTEMPTS || "5", 10);
  const downloadCount = await db.downloadLog.count({
    where: { orderItemId, success: true },
  });

  if (downloadCount >= maxAttempts) {
    return new NextResponse("Forbidden: You have reached the maximum download limit.", { status: 403 });
  }

  // 4. Validate Expiration (TTL)
  const ttlDays = parseInt(process.env.SIGNED_URL_TTL_DAYS || "7", 10);
  const orderDate = item.order.createdAt;
  const expiryDate = new Date(orderDate);
  expiryDate.setDate(orderDate.getDate() + ttlDays);

  if (new Date() > expiryDate) {
    return new NextResponse("Forbidden: The download link for this item has expired.", { status: 403 });
  }

  try {
    const url = await getSignedDownloadUrl({
      bucket: process.env.S3_BUCKET!,
      key: item.product.fileKey,
      expiresIn: 300, // 5 minutes
    });

    // Log the successful download attempt
    await db.downloadLog.create({
      data: {
        orderItemId: item.id,
        userId,
        ip: req.ip ?? "unknown",
        userAgent: req.headers.get("user-agent") ?? "unknown",
        success: true,
      },
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Failed to generate signed URL or log download:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}