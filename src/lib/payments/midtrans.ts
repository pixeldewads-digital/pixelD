// Placeholder for Midtrans integration
// See: https://docs.midtrans.com/en/snap/overview

import { Order } from "@prisma/client";
import { CartItem } from "../store/cart";

export async function createMidtransTransaction(
  order: Order,
  cart: CartItem[]
) {
  // TODO: Implement Midtrans Snap transaction creation
  // 1. Initialize midtrans-client
  // 2. Create parameter object with transaction_details, item_details, customer_details
  // 3. Call snap.createTransaction(parameter)
  // 4. Return the Snap token or redirect URL

  console.log("Midtrans transaction creation is not yet implemented.");

  return {
    token: "dummy-midtrans-snap-token",
    redirect_url: "/payment-unsupported",
  };
}