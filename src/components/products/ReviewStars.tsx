import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewStarsProps {
  reviews: { rating: number }[];
  className?: string;
}

export function ReviewStars({ reviews, className }: ReviewStarsProps) {
  if (reviews.length === 0) {
    return <div className={cn("text-sm text-muted-foreground", className)}>New</div>;
  }

  const avgRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < Math.round(avgRating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          )}
        />
      ))}
      <span className="text-sm text-muted-foreground ml-1">({reviews.length})</span>
    </div>
  );
}