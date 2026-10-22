import type { CartItem } from "../types/store";
import type { ShippingQuote } from "../types/shipping";
export class ShippingQuoteError extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ShippingQuoteError";
  }
}
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
  let data;
  try {
    data = await response.json();
  } catch {
    throw new ShippingQuoteError(
      "shipping_unavailable",
      "O serviço de frete não respondeu corretamente. Tente novamente mais tarde.",
    );
  }
  if (!response.ok)
    throw new ShippingQuoteError(
      data.code || "shipping_unavailable",
      data.message || "Não foi possível consultar o frete.",
    );
  return data;
}
