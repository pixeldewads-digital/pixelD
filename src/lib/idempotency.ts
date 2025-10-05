import { createHash } from "crypto";
import { CartItem } from "./store/cart";

export function generateIdempotencyKey(cart: CartItem[], userId: string): string {
  const sortedCart = [...cart].sort((a, b) => a.id.localeCompare(b.id));
  const cartString = JSON.stringify(sortedCart);

  return createHash("sha256")
    .update(cartString)
    .update(userId)
    .digest("hex");
}