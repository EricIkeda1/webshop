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
  total: number;
  payment: string;
}
