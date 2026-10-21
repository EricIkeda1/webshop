import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useProducts } from "../hooks/useProducts";
import type { Product } from "../types/product";
import type { CartItem, Order } from "../types/store";
interface StoreValue {
  products: Product[];
  registerProducts: (products: Product[]) => void;
  loading: boolean;
  offline: boolean;
  error: string;
  retry: () => void;
  cart: CartItem[];
  favorites: number[];
  orders: Order[];
  subtotal: number;
  count: number;
  coupon: string;
  discount: number;
  toast: string;
  notify: (message: string) => void;
  clearToast: () => void;
  addToCart: (product: Product, quantity?: number) => boolean;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  toggleFavorite: (id: number) => void;
  applyCoupon: (value: string) => void;
  placeOrder: (shipping: number, payment: string) => Order | null;
}
const StoreContext = createContext<StoreValue | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const catalog = useProducts();
  const [cart, setCart] = useLocalStorage<CartItem[]>("eyi-react-cart", []);
  const [favorites, setFavorites] = useLocalStorage<number[]>(
    "eyi-react-favorites",
    [],
  );
  const [orders, setOrders] = useLocalStorage<Order[]>("eyi-react-orders", []);
  const [coupon, setCoupon] = useState("");
  const [toast, setToast] = useState("");
  const notify = useCallback((message: string) => setToast(message), []);
  const clearToast = useCallback(() => setToast(""), []);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const discount = coupon === "EYI10" ? subtotal * 0.1 : 0;
  function addToCart(product: Product, quantity = 1) {
    const current =
      cart.find((item) => item.product.id === product.id)?.quantity ?? 0;
    if (quantity < 1 || current + quantity > product.stock) {
      notify("Limite de estoque atingido.");
      return false;
    }
    setCart((items) => {
      const existing = items.find((item) => item.product.id === product.id);
      return existing
        ? items.map((item) =>
            item.product.id === product.id
              ? { product, quantity: item.quantity + quantity }
              : item,
          )
        : [...items, { product, quantity }];
    });
    notify("Adicionado ao carrinho. Seu próximo favorito está lá!");
    return true;
  }
  function updateQuantity(id: number, quantity: number) {
    setCart((items) =>
      items.map((item) =>
        item.product.id === id
          ? {
              ...item,
              quantity: Math.max(1, Math.min(item.product.stock, quantity)),
            }
          : item,
      ),
    );
  }
  function removeFromCart(id: number) {
    setCart((items) => items.filter((item) => item.product.id !== id));
    notify("Produto removido do carrinho.");
  }
  function toggleFavorite(id: number) {
    setFavorites((items) =>
      items.includes(id)
        ? items.filter((value) => value !== id)
        : [...items, id],
    );
  }
  function applyCoupon(value: string) {
    const code = value.trim().toUpperCase();
    setCoupon(code === "EYI10" ? code : "");
    notify(
      code === "EYI10"
        ? "Cupom aplicado: 10% de desconto!"
        : "Cupom inválido. Experimente EYI10.",
    );
  }
  function placeOrder(shipping: number, payment: string) {
    if (!cart.length) return null;
    const order: Order = {
      id: `EYI-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      date: new Date().toISOString(),
      items: cart.map((item) => ({ ...item })),
      subtotal,
      discount,
      shipping,
      total: subtotal - discount + shipping,
      payment,
    };
    setOrders((items) => [order, ...items]);
    setCart([]);
    setCoupon("");
    return order;
  }
  return (
    <StoreContext.Provider
      value={{
        ...catalog,
        cart,
        favorites,
        orders,
        subtotal,
        count,
        coupon,
        discount,
        toast,
        notify,
        clearToast,
        addToCart,
        updateQuantity,
        removeFromCart,
        toggleFavorite,
        applyCoupon,
        placeOrder,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}
export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore precisa de StoreProvider.");
  return context;
}
