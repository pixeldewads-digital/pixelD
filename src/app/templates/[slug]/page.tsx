import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ProductDetails } from "./_components/ProductDetails";
import { ReviewsSection } from "./_components/ReviewsSection";
import { RelatedProducts } from "./_components/RelatedProducts";
import { Suspense } from "react";

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const product = await db.product.findUnique({
    where: { slug: params.slug, status: "PUBLISHED" },
  });

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.title} | PixelDew`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [product.coverImageUrl],
      type: "article",
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const product = await db.product.findUnique({
    where: { slug: params.slug, status: "PUBLISHED" },
    include: { reviews: { include: { user: true }, orderBy: { createdAt: "desc" } } },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="container my-10">
      <ProductDetails product={product} />
      <ReviewsSection reviews={product.reviews} />
      <Suspense fallback={<div className="mt-12">Loading related products...</div>}>
        <RelatedProducts
          currentProductId={product.id}
          category={product.category}
        />
      </Suspense>
    </div>
  );
}