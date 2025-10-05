import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/formatters";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Suspense } from "react";
import { OrdersTableSkeleton } from "./_components/OrdersTableSkeleton";
import { OrderFilterControls } from "./_components/OrderFilterControls";
import { PaymentStatus, Prisma } from "@prisma/client";

type AdminOrdersPageProps = {
  searchParams: {
    status?: PaymentStatus;
    from?: string;
    to?: string;
  };
};

async function getOrders({ status, from, to }: AdminOrdersPageProps["searchParams"]) {
  const where: Prisma.OrderWhereInput = {};
  if (status) {
    where.paymentStatus = status;
  }
  if (from) {
    where.createdAt = { gte: new Date(from) };
  }
  if (to) {
    where.createdAt = { ...where.createdAt, lte: new Date(to) };
  }

  return db.order.findMany({
    where,
    select: {
      id: true,
      totalCents: true,
      paymentStatus: true,
      createdAt: true,
      user: { select: { email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  return (
    <>
      <div className="flex justify-between items-center gap-4 mb-4">
        <h1 className="text-lg font-semibold md:text-2xl">Orders</h1>
      </div>
      <OrderFilterControls />
      <Suspense fallback={<OrdersTableSkeleton />} key={JSON.stringify(searchParams)}>
        <OrderList searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function OrderList({ searchParams }: AdminOrdersPageProps) {
  const orders = await getOrders(searchParams);
  return <OrdersTable orders={orders} />;
}

type OrdersTableProps = {
  orders: Awaited<ReturnType<typeof getOrders>>;
};

function OrdersTable({ orders }: OrdersTableProps) {
  if (orders.length === 0) return <p>No orders found.</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.user.email}</TableCell>
            <TableCell>{formatCurrency(order.totalCents / 100)}</TableCell>
            <TableCell>{order.paymentStatus}</TableCell>
            <TableCell>{order.createdAt.toLocaleDateString()}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/orders/${order.id}`}>View Details</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}