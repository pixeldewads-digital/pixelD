import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriceBadge } from "./PriceBadge";
import { ReviewStars } from "./ReviewStars";
import { Product } from "@prisma/client";

type ProductCardProps = Product & {
  reviews: { rating: number }[];
};

export function ProductCard({
  id,
  slug,
  title,
  priceCents,
  currency,
  coverImageUrl,
  reviews,
}: ProductCardProps) {
  return (
    <Link href={`/templates/${slug}`} className="group">
      <Card className="h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:-translate-y-1">
        <div className="relative w-full h-48">
          <Image
            src={coverImageUrl}
            alt={title}
            fill
            className="object-cover rounded-t-lg"
          />
        </div>
        <CardHeader>
          <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-end">
          <div className="flex justify-between items-center mt-2">
            <PriceBadge priceCents={priceCents} currency={currency} />
            <ReviewStars reviews={reviews} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}