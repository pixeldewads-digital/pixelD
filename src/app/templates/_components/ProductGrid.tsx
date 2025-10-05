import { db } from "@/lib/db";
import { ProductCard } from "@/components/products/ProductCard";
import { Category, Prisma } from "@prisma/client";

interface ProductGridProps {
  category?: Category;
  sort?: "newest" | "price_asc" | "price_desc";
}

export async function ProductGrid({ category, sort }: ProductGridProps) {
  const whereClause: Prisma.ProductWhereInput = {
    status: "PUBLISHED",
    ...(category && { category }),
  };

  const orderByClause: Prisma.ProductOrderByWithRelationInput =
    sort === "price_asc"
      ? { priceCents: "asc" }
      : sort === "price_desc"
      ? { priceCents: "desc" }
      : { createdAt: "desc" };

  const products = await db.product.findMany({
    where: whereClause,
    orderBy: orderByClause,
    include: { reviews: { select: { rating: true } } },
  });

  if (products.length === 0) {
    return <p className="text-center text-muted-foreground">No products found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}