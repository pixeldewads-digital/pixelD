import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function CancelPage() {
  return (
    <div className="container my-10 text-center">
      <div className="flex justify-center mb-4">
        <XCircle className="h-16 w-16 text-red-500" />
      </div>
      <h1 className="text-3xl font-bold mb-4">Checkout Canceled</h1>
      <p className="text-muted-foreground mb-6">
        Your checkout session has been canceled. You can return to your cart to
        continue shopping.
      </p>
      <Button asChild>
        <Link href="/cart">Return to Cart</Link>
      </Button>
    </div>
  );
}