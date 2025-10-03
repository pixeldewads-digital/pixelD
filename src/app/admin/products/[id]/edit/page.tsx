import { db } from "@/lib/db";
import { ProductForm } from "../../_components/ProductForm";

export default async function EditProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await db.product.findUnique({ where: { id } });

  return (
    <>
      <h1 className="text-lg font-semibold md:text-2xl mb-4">Edit Product</h1>
      <ProductForm product={product} />
    </>
  );
}