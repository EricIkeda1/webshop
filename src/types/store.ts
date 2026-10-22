import type { Product } from "./product";
export interface CartItem {
  product: Product;
  quantity: number;
}
export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  shippingQuoted?: boolean;
  shippingSandbox?: boolean;
  total: number;
  payment: string;
}
