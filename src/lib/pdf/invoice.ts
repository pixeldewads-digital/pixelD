import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Order, OrderItem, Product, User } from "@prisma/client";
import { formatCurrency } from "../formatters";

type FullOrder = Order & {
  user: User;
  items: (OrderItem & { product: Product })[];
};

export async function generateInvoicePdf(order: FullOrder): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const fontSize = 12;
  const margin = 50;
  let y = height - margin;

  // Header
  page.drawText("PixelDew Invoice", {
    x: margin,
    y,
    font: boldFont,
    size: 24,
    color: rgb(0, 0, 0),
  });
  y -= 40;

  // Order Details
  page.drawText(`Order ID: ${order.id.slice(0, 12)}`, { x: margin, y, font, size: fontSize });
  page.drawText(`Date: ${order.createdAt.toLocaleDateString()}`, { x: width - margin - 150, y, font, size: fontSize });
  y -= 20;
  page.drawText(`Billed to: ${order.user.name ?? order.user.email}`, { x: margin, y, font, size: fontSize });
  y -= 40;

  // Table Header
  page.drawText("Item", { x: margin, y, font: boldFont, size: fontSize });
  page.drawText("Quantity", { x: width / 2, y, font: boldFont, size: fontSize });
  page.drawText("Price", { x: width - margin - 100, y, font: boldFont, size: fontSize });
  y -= 20;
  page.drawLine({
    start: { x: margin, y },
    end: { x: width - margin, y },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  y -= 20;

  // Table Rows
  for (const item of order.items) {
    page.drawText(item.product.title, { x: margin, y, font, size: fontSize });
    page.drawText(item.quantity.toString(), { x: width / 2, y, font, size: fontSize });
    page.drawText(formatCurrency(item.priceCents / 100), { x: width - margin - 100, y, font, size: fontSize });
    y -= 20;
  }

  // Footer
  page.drawLine({
    start: { x: margin, y },
    end: { x: width - margin, y },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  y -= 30;
  page.drawText("Total Paid", { x: width - margin - 200, y, font: boldFont, size: 14 });
  page.drawText(formatCurrency(order.totalCents / 100), { x: width - margin - 100, y, font: boldFont, size: 14 });

  return pdfDoc.save();
}