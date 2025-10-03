import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import { ProductsTable } from "./_components/ProductsTable";
import { ProductsTableSkeleton } from "./_components/ProductsTableSkeleton";
import { db } from "@/lib/db";
import { Category, ProductStatus, Prisma } from "@prisma/client";
import { ProductFilterControls } from "./_components/ProductFilterControls";

type AdminProductsPageProps = {
  searchParams: {
    search?: string;
    category?: Category;
    status?: ProductStatus;
    sort?: string;
  };
};

async function getProducts({
  search,
  category,
  status,
  sort,
}: AdminProductsPageProps["searchParams"]) {
  const where: Prisma.ProductWhereInput = {};
  if (search) {
    where.title = { contains: search, mode: "insensitive" };
  }
  if (category) {
    where.category = category;
  }
  if (status) {
    where.status = status;
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput = {};
  if (sort) {
    const [key, direction] = sort.split("_");
    if (["title", "priceCents", "status"].includes(key)) {
      orderBy[key] = direction;
    }
  } else {
    orderBy.title = "asc";
  }

  return db.product.findMany({
    where,
    select: {
      id: true,
      title: true,
      priceCents: true,
      status: true,
      _count: { select: { items: true } },
    },
    orderBy,
  });
}

export default function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  return (
    <>
      <div className="flex justify-between items-center gap-4 mb-4">
        <h1 className="text-lg font-semibold md:text-2xl">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>
      <ProductFilterControls />
      <Suspense fallback={<ProductsTableSkeleton />} key={JSON.stringify(searchParams)}>
        <ProductList searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function ProductList({ searchParams }: AdminProductsPageProps) {
  const products = await getProducts(searchParams);
  return <ProductsTable products={products} />;
}