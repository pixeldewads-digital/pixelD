import { Suspense } from "react";
import { db } from "@/lib/db";
import { ReviewsTable } from "./_components/ReviewsTable";
import { ReviewsTableSkeleton } from "./_components/ReviewsTableSkeleton";

async function getReviews() {
  return db.review.findMany({
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
      visible: true,
      user: { select: { email: true } },
      product: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default function AdminReviewsPage() {
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-lg font-semibold md:text-2xl">Reviews</h1>
      </div>
      <Suspense fallback={<ReviewsTableSkeleton />}>
        <ReviewList />
      </Suspense>
    </>
  );
}

async function ReviewList() {
  const reviews = await getReviews();
  return <ReviewsTable reviews={reviews} />;
}