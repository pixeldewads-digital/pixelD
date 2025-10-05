import { db } from "@/lib/db";
import { ProductCard } from "@/components/products/ProductCard";
import { Category } from "@prisma/client";

interface RelatedProductsProps {
  currentProductId: string;
  category: Category;
}

export async function RelatedProducts({
  currentProductId,
  category,
}: RelatedProductsProps) {
  const products = await db.product.findMany({
    where: {
      status: "PUBLISHED",
      category,
      id: { not: currentProductId },
    },
    take: 4,
    include: { reviews: { select: { rating: true } } },
  });

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold mb-6">Related Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}