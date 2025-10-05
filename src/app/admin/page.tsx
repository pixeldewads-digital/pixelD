import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/formatters";
import { subDays } from "date-fns";

async function getSalesData() {
  const thirtyDaysAgo = subDays(new Date(), 30);
  const data = await db.order.aggregate({
    _sum: { totalCents: true },
    _count: true,
    where: { paymentStatus: "PAID", createdAt: { gte: thirtyDaysAgo } },
  });

  return {
    amount: (data._sum.totalCents || 0) / 100,
    numberOfSales: data._count,
  };
}

async function getOrderData() {
  const [totalOrders, avgOrderValue] = await Promise.all([
    db.order.count({ where: { paymentStatus: "PAID" } }),
    db.order.aggregate({
      _avg: { totalCents: true },
      where: { paymentStatus: "PAID" },
    }),
  ]);

  return {
    totalOrders,
    avgOrderValue: (avgOrderValue._avg.totalCents || 0) / 100,
  };
}

async function getTopProducts() {
  const topProducts = await db.orderItem.groupBy({
    by: ["productId"],
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 3,
  });

  const productIds = topProducts.map(p => p.productId);
  const products = await db.product.findMany({
    where: { id: { in: productIds } },
  });

  return topProducts.map(tp => {
    const product = products.find(p => p.id === tp.productId);
    return {
      title: product?.title ?? "Unknown Product",
      quantity: tp._sum.quantity ?? 0,
    };
  });
}

export default async function AdminDashboardPage() {
  const [salesData, orderData, topProducts] = await Promise.all([
    getSalesData(),
    getOrderData(),
    getTopProducts(),
  ]);

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Revenue (30d)</CardTitle>
            <CardDescription>
              Total revenue from sales in the last 30 days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(salesData.amount)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sales (30d)</CardTitle>
            <CardDescription>
              Total number of sales in the last 30 days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{salesData.numberOfSales}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg. Order Value</CardTitle>
            <CardDescription>
              Average value of all paid orders.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(orderData.avgOrderValue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>
              The top 3 best-selling products.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {topProducts.map(p => (
                <li key={p.title} className="flex justify-between">
                  <span>{p.title}</span>
                  <span className="font-semibold">{p.quantity} sold</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sales Chart</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-80 w-full flex items-center justify-center text-muted-foreground">
              [Chart Placeholder]
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>
              You made 265 sales this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground">
              [Recent Sales List Placeholder]
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}