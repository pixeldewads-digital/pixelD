"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { auth } from "@/auth.config";

export async function toggleReviewVisibility(id: string, visible: boolean) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const review = await db.review.update({
    where: { id },
    data: { visible },
  });

  if (review == null) return notFound();

  revalidatePath("/admin/reviews");
  revalidatePath(`/templates/${review.productId}`);
}

export async function deleteReview(id: string) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const review = await db.review.delete({ where: { id } });
  if (review == null) return notFound();

  revalidatePath("/admin/reviews");
  revalidatePath(`/templates/${review.productId}`);
}