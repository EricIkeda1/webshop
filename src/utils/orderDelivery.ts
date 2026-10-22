import type { CartItem } from "../types/store";
import type { ShippingSelection } from "../types/shipping";
import { cartShippingKey } from "../services/shippingApi";
/** A missing quote is not free shipping; a demo can still be completed. */
export function orderDelivery(
  selection: ShippingSelection | null,
  cart: CartItem[],
  cep: string,
  now = Date.now(),
) {
  const quoted =
    !!selection &&
    selection.option.expiresAt > now &&
    selection.cartKey === cartShippingKey(cart) &&
    selection.cep === cep.replace(/\D/g, "");
  return {
    shipping: quoted ? selection!.option.price : 0,
    shippingQuoted: quoted,
    shippingSandbox: quoted ? selection!.sandbox : false,
  };
}
