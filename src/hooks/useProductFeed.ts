import { useCallback, useEffect, useRef, useState } from "react";
import { createProductFeed } from "../services/productFeed";
import type { FeedFilters } from "../services/productFeed";
import type { Product } from "../types/product";
import { useStore } from "../contexts/StoreContext";
export function useProductFeed(filters: FeedFilters) {
  const { registerProducts } = useStore();
  const key = JSON.stringify(filters);
  const session = useRef<ReturnType<typeof createProductFeed> | null>(null);
  const request = useRef<AbortController | null>(null);
  const busy = useRef(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState("");
  const loadMore = useCallback(async () => {
    if (!session.current || busy.current) return;
    busy.current = true;
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    setError("");
    try {
      const result = await session.current.next(controller.signal);
      if (controller.signal.aborted) return;
      setProducts((current) => [...current, ...result.products]);
      setHasMore(result.hasMore);
      setOffline(result.offline);
      registerProducts(result.products);
    } catch {
      if (!controller.signal.aborted)
        setError(
          "Não foi possível carregar os próximos produtos. Tente novamente.",
        );
    } finally {
      if (!controller.signal.aborted) {
        busy.current = false;
        setLoading(false);
      }
    }
  }, [registerProducts]);
  useEffect(() => {
    request.current?.abort();
    busy.current = false;
    session.current = createProductFeed(JSON.parse(key) as FeedFilters);
    setProducts([]);
    setHasMore(true);
    setOffline(false);
    setError("");
    void loadMore();
    return () => {
      request.current?.abort();
    };
  }, [key, loadMore]);
  return { products, loading, hasMore, offline, error, loadMore };
}
