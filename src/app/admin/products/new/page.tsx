import { ProductForm } from "../_components/ProductForm";

export default function NewProductPage() {
  return (
    <>
      <h1 className="text-lg font-semibold md:text-2xl mb-4">Add New Product</h1>
      <ProductForm />
    </>
  );
}