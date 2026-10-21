import { useEffect, useState } from "react";
import { getProducts } from "../services/productsApi";
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
    getProducts(controller.signal)
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
  return {
    products,
    loading,
    offline,
    error,
    retry: () => setAttempt((value) => value + 1),
  };
}
