import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";

export default async function OrderDetailPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const order = await db.order.findUnique({
    where: { id },
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
    return notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold md:text-2xl">
        Order Details
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Order #{order.id.slice(0, 8)}</CardTitle>
          <CardDescription>
            Placed on {order.createdAt.toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold">Customer</h3>
              <p>{order.user.name}</p>
              <p>{order.user.email}</p>
            </div>
            <div>
              <h3 className="font-semibold">Payment Details</h3>
              <p>Status: {order.paymentStatus}</p>
              <p>Provider: {order.provider}</p>
              <p className="font-bold text-lg mt-2">
                Total: {formatCurrency(order.totalCents / 100)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Items Ordered</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p className="font-semibold">{item.product.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p>{formatCurrency(item.priceCents / 100)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}