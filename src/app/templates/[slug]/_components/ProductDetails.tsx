"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PriceBadge } from "@/components/products/PriceBadge";
import { LicenseBadge } from "@/components/products/LicenseBadge";
import { Product } from "@prisma/client";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { toast } from "sonner";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(product.coverImageUrl);
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      priceCents: product.priceCents,
      coverImageUrl: product.coverImageUrl,
    });
    toast.success(`${product.title} has been added to your cart.`);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      <div>
        <div className="relative h-96 w-full mb-4">
          <Image
            src={selectedImage}
            alt={product.title}
            fill
            className="object-contain rounded-lg"
          />
        </div>
        <div className="flex gap-2">
          {[product.coverImageUrl, ...product.galleryUrls].map((url, i) => (
            <div
              key={i}
              className={cn(
                "relative h-20 w-20 cursor-pointer rounded-md border-2",
                selectedImage === url ? "border-primary" : "border-transparent"
              )}
              onClick={() => setSelectedImage(url)}
            >
              <Image
                src={url}
                alt={`${product.title} thumbnail ${i + 1}`}
                fill
                className="object-cover rounded-sm"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">{product.title}</h1>
        <div className="flex items-center gap-4">
          <PriceBadge priceCents={product.priceCents} currency={product.currency} className="text-lg" />
          <LicenseBadge license={product.license} />
        </div>
        <p className="text-muted-foreground">{product.description}</p>

        <div>
          <h3 className="font-semibold mb-2">Formats Included:</h3>
          <div className="flex flex-wrap gap-2">
            {product.formats.map(format => (
              <Badge key={format} variant="outline">{format}</Badge>
            ))}
          </div>
        </div>

        <Button size="lg" className="mt-4" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </div>
    </div>
  );
}