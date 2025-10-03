"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteReview, toggleReviewVisibility } from "../_actions";
import { ReviewStars } from "@/components/products/ReviewStars";
import { useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

type Review = {
  id: string;
  rating: number;
  comment: string;
  visible: boolean;
  createdAt: Date;
  user: { email: string | null };
  product: { title: string };
};

type ReviewsTableProps = {
  reviews: Review[];
};

export function ReviewsTable({ reviews }: ReviewsTableProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggleVisibility = (id: string, currentVisibility: boolean) => {
    startTransition(async () => {
      await toggleReviewVisibility(id, !currentVisibility);
      toast.success("Review visibility updated.");
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to permanently delete this review?")) {
      startTransition(async () => {
        await deleteReview(id);
        toast.success("Review deleted successfully.");
      });
    }
  };

  if (reviews.length === 0) return <p>No reviews found.</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Comment</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reviews.map((review) => (
          <TableRow key={review.id}>
            <TableCell>{review.product.title}</TableCell>
            <TableCell>{review.user.email}</TableCell>
            <TableCell>
              <ReviewStars reviews={[{ rating: review.rating }]} />
            </TableCell>
            <TableCell>
              <Badge variant={review.visible ? "default" : "secondary"}>
                {review.visible ? "Visible" : "Hidden"}
              </Badge>
            </TableCell>
            <TableCell>
              <p className="line-clamp-2">{review.comment}</p>
            </TableCell>
            <TableCell>{review.createdAt.toLocaleDateString()}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger disabled={isPending}>
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => handleToggleVisibility(review.id, review.visible)}
                  >
                    {review.visible ? "Hide" : "Show"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleDelete(review.id)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}