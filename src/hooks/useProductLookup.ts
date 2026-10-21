import { useEffect, useState } from "react";
import { useStore } from "../contexts/StoreContext";
import { getProduct } from "../services/productsApi";
/** Restore saved favorites and open deep links without preloading the catalog. */
export function useProductLookup(ids: number[]) {
  const { products, registerProducts } = useStore();
  const missingKey = [
    ...new Set(
      ids.filter((id) => !products.some((product) => product.id === id)),
    ),
  ]
    .sort((a, b) => a - b)
    .join(",");
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    setError("");
    if (!missingKey) return;
    const controller = new AbortController();
    const missing = missingKey.split(",").map(Number);
    Promise.all(missing.map((id) => getProduct(id, controller.signal)))
      .then((results) => {
        if (!controller.signal.aborted)
          registerProducts(results.map((result) => result.product));
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setError("Não foi possível carregar esta seleção.");
      });
    return () => controller.abort();
  }, [missingKey, registerProducts, attempt]);
  return {
    loading: !!missingKey && !error,
    error,
    retry: () => setAttempt((value) => value + 1),
  };
}
