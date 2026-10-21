import { useCallback, useEffect, useState } from "react";
import { getFeaturedProducts } from "../services/productsApi";
import type { Product } from "../types/product";
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    getFeaturedProducts(controller.signal)
      .then((data) => {
        setProducts(data.products);
        setOffline(data.offline);
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setError(
            "Não foi possível carregar os produtos. Verifique sua conexão.",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt]);
  const registerProducts = useCallback((incoming: Product[]) => {
    if (!incoming.length) return;
    setProducts((current) => {
      const seen = new Set(current.map((product) => product.id));
      const additions = incoming.filter((product) => !seen.has(product.id));
      return additions.length ? [...current, ...additions] : current;
    });
  }, []);
  return {
    products,
    registerProducts,
    loading,
    offline,
    error,
    retry: () => setAttempt((value) => value + 1),
  };
}
