"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { productSchema } from "@/lib/admin/validators";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth.config";

export async function addProduct(prevState: unknown, formData: FormData) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const result = productSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!result.success) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  await db.product.create({ data });

  revalidatePath("/admin/products");
  revalidatePath("/templates");
  redirect("/admin/products");
}

export async function updateProduct(id: string, prevState: unknown, formData: FormData) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const result = productSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!result.success) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  const product = await db.product.findUnique({ where: { id } });
  if (product == null) return notFound();

  await db.product.update({ where: { id }, data });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}/edit`);
  revalidatePath(`/templates/${product.slug}`);
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const product = await db.product.delete({ where: { id } });
  if (product == null) return notFound();

  revalidatePath("/admin/products");
  revalidatePath(`/templates/${product.slug}`);
}

export async function toggleProductStatus(id: string, status: "DRAFT" | "PUBLISHED") {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await db.product.update({ where: { id }, data: { status } });

  revalidatePath("/admin/products");
}