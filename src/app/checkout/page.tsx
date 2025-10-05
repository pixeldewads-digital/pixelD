"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/formatters";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/checkout");
    }
    if (status === "authenticated" && items.length === 0) {
      router.push("/cart");
    }
  }, [status, items, router]);

  async function handleCheckout() {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: items }),
      });

      const { redirectUrl } = await response.json();

      if (redirectUrl) {
        clearCart();
        window.location.href = redirectUrl;
      } else {
        alert("There was an issue creating the checkout session.");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Checkout failed", error);
      alert("An error occurred during checkout. Please try again.");
      setIsProcessing(false);
    }
  }

  if (status === "loading" || !session) {
    return <div className="container text-center my-10">Loading...</div>;
  }

  if (items.length === 0) {
    return <div className="container text-center my-10">Your cart is empty. Redirecting...</div>;
  }

  return (
    <div className="container my-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-2 mb-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.title} x {item.quantity}</span>
              <span>{formatCurrency((item.priceCents * item.quantity) / 100)}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{formatCurrency(subtotal() / 100)}</span>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold">Email</h3>
          <p className="text-muted-foreground">{session.user?.email}</p>
        </div>
        <Button onClick={handleCheckout} disabled={isProcessing} className="w-full mt-6">
          {isProcessing ? "Processing..." : "Proceed to Payment"}
        </Button>
      </div>
    </div>
  );
}