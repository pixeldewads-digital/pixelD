"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div className="container my-10 text-center">
      <div className="flex justify-center mb-4">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
      </div>
      <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-muted-foreground mb-6">
        Thank you for your purchase. Your order is being processed.
      </p>
      {orderId && (
        <p className="text-sm text-muted-foreground mb-6">
          Order ID: {orderId}
        </p>
      )}
      <div className="flex justify-center gap-4">
        <Button asChild>
          <Link href="/templates">Continue Shopping</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/account">View My Orders</Link>
        </Button>
      </div>
    </div>
  );
}


export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="container my-10 text-center">Loading...</div>}>
      <SuccessPageContent />
    </Suspense>
  )
}