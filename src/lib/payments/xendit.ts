// Placeholder for Xendit integration
// See: https://developers.xendit.co/api-reference/

import { Order } from "@prisma/client";
import { CartItem } from "../store/cart";

export async function createXenditInvoice(
  order: Order,
  cart: CartItem[]
) {
  // TODO: Implement Xendit Invoice creation
  // 1. Initialize xendit-node
  // 2. Create invoice with parameters: external_id, amount, payer_email, description
  // 3. Return the invoice_url

  console.log("Xendit invoice creation is not yet implemented.");

  return {
    invoice_url: "/payment-unsupported",
  };
}