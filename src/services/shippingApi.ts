import type { CartItem } from "../types/store";
import type { ShippingQuote } from "../types/shipping";
export const cartShippingKey = (items: CartItem[]) =>
  items
    .map((item) => `${item.product.id}:${item.quantity}`)
    .sort()
    .join("|");
export async function getShippingQuote(
  cep: string,
  items: CartItem[],
  signal?: AbortSignal,
): Promise<ShippingQuote> {
  const response = await fetch("/api/shipping/quote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cep: cep.replace(/\D/g, ""),
      items: items.map((item) => ({
        id: item.product.id,
        quantity: item.quantity,
      })),
    }),
    signal,
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.message || "Não foi possível consultar o frete.");
  return data;
}
