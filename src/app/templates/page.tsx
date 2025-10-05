import { SkeletonProductCard } from "@/components/products/SkeletonProductCard";
import { Suspense } from "react";
import { ProductGrid } from "./_components/ProductGrid";
import { FilterControls } from "./_components/FilterControls";
import { Category } from "@prisma/client";

interface TemplatesPageProps {
  searchParams: {
    category?: Category;
    sort?: "newest" | "price_asc" | "price_desc";
  };
}

export default function TemplatesPage({ searchParams }: TemplatesPageProps) {
  return (
    <div className="container my-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Explore Our Templates</h1>
        <p className="text-muted-foreground mt-2">
          Find the perfect template to kickstart your next project.
        </p>
      </div>

      <FilterControls />

      <Suspense fallback={<LoadingGrid />} key={JSON.stringify(searchParams)}>
        <ProductGrid
          category={searchParams.category}
          sort={searchParams.sort}
        />
      </Suspense>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonProductCard key={i} />
      ))}
    </div>
  );
}