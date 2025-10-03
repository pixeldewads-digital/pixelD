import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewStars } from "@/components/products/ReviewStars";
import { Review, User } from "@prisma/client";

type ReviewWithUser = Review & { user: User };

interface ReviewsSectionProps {
  reviews: ReviewWithUser[];
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <CardTitle>Overall Rating</CardTitle>
            <ReviewStars reviews={reviews} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {reviews.slice(0, 3).map((review) => (
            <div key={review.id} className="flex gap-4">
              <Avatar>
                <AvatarImage src={review.user.image ?? ""} alt={review.user.name ?? ""} />
                <AvatarFallback>{review.user.name?.charAt(0).toUpperCase() ?? "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{review.user.name}</p>
                  <ReviewStars reviews={[{ rating: review.rating }]} />
                </div>
                <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}