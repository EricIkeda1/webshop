import type { AddressFields } from "../types/address";
import type { CartItem } from "../types/store";
import type { ShippingQuote } from "../types/shipping";
import { lookupAddress, PostalLookupError } from "./addressApi";
import { getShippingQuote, ShippingQuoteError } from "./shippingApi";
export interface DeliveryEstimate {
  destination: (AddressFields & { cep: string }) | null;
  addressWarning: string;
  quote: ShippingQuote | null;
  error: string;
  errorCode: string;
}
/** Address lookup and a carrier quote are independent results. */
export async function getDeliveryEstimate(
  cep: string,
  items: CartItem[],
  signal?: AbortSignal,
): Promise<DeliveryEstimate> {
  const result: DeliveryEstimate = {
    destination: null,
    addressWarning: "",
    quote: null,
    error: "",
    errorCode: "",
  };
  signal?.throwIfAborted();
  try {
    result.destination = await lookupAddress(cep, { signal });
  } catch (error) {
    signal?.throwIfAborted();
    if (
      error instanceof PostalLookupError &&
      ["invalid", "not-found"].includes(error.kind)
    )
      throw error;
    result.addressWarning =
      "Não foi possível buscar o endereço agora. A consulta de frete será tentada com o CEP informado.";
  }
  signal?.throwIfAborted();
  try {
    result.quote = await getShippingQuote(cep, items, signal);
  } catch (error) {
    signal?.throwIfAborted();
    result.errorCode =
      error instanceof ShippingQuoteError ? error.code : "shipping_unavailable";
    result.error = [
      "shipping_not_configured",
      "packages_not_configured",
    ].includes(result.errorCode)
      ? "A cotação de frete real ainda precisa ser ativada pela loja. Não é possível informar um preço de entrega neste momento."
      : error instanceof Error
        ? error.message
        : "Não foi possível consultar o frete agora.";
  }
  return result;
}
