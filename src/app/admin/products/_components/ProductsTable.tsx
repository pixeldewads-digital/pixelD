"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatters";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { deleteProduct, toggleProductStatus } from "../_actions";
import { useTransition } from "react";
import { toast } from "sonner";

type Product = {
  id: string;
  title: string;
  priceCents: number;
  status: string;
  _count: { items: number };
};

type ProductsTableProps = {
  products: Product[];
};

export function ProductsTable({ products }: ProductsTableProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteProduct(id);
      toast.success("Product deleted successfully.");
    });
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    startTransition(async () => {
      await toggleProductStatus(id, currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED");
      toast.success("Product status updated.");
    });
  };

  if (products.length === 0) return <p>No products found.</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>{product.title}</TableCell>
            <TableCell>{formatCurrency(product.priceCents / 100)}</TableCell>
            <TableCell>{product.status}</TableCell>
            <TableCell>{product._count.items}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger disabled={isPending}>
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleToggleStatus(product.id, product.status)}
                  >
                    {product.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(product.id)}>
                    Delete
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