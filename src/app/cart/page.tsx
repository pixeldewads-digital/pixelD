"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/formatters";
import { MinusCircle, PlusCircle, Trash2 } from "lucide-react";

export default function CartPage() {
  const { items, subtotal, incrementItem, decrementItem, removeItem } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container my-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Button asChild>
          <Link href="/templates">Explore Templates</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container my-10">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                <div className="relative h-24 w-24 flex-shrink-0">
                  <Image
                    src={item.coverImageUrl}
                    alt={item.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex-grow">
                  <h2 className="font-semibold">{item.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(item.priceCents / 100)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => decrementItem(item.id)}>
                    <MinusCircle className="h-5 w-5" />
                  </Button>
                  <span>{item.quantity}</span>
                  <Button variant="ghost" size="icon" onClick={() => incrementItem(item.id)}>
                    <PlusCircle className="h-5 w-5" />
                  </Button>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                  <Trash2 className="h-5 w-5 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-1">
          <div className="border rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal() / 100)}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Taxes and shipping calculated at checkout.
            </p>
            <Button asChild className="w-full">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}