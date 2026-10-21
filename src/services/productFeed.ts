import type { Product } from "../types/product";
import { categories, categoryLabel } from "../utils/categories";
import { getProductPage } from "./productsApi";
import type { PageOptions } from "./productsApi";
export const PAGE_SIZE = 12;
export interface FeedFilters {
  query?: string;
  category?: string;
  maxPrice?: number;
  rating?: number;
  sort?: string;
  offers?: boolean;
}
interface Source {
  category?: string;
  queue: Product[];
  skip: number;
  exhausted: boolean;
  total: number;
}
/** Merge sorted, paginated category streams, without downloading the full catalog. */
export function createProductFeed(filters: FeedFilters) {
  const slugs = categories[filters.category ?? "Todos"] ?? [];
  const sources: Source[] = (slugs.length ? slugs : [undefined]).map(
    (category) => ({
      category,
      queue: [],
      skip: 0,
      exhausted: false,
      total: 0,
    }),
  );
  const sortBy: PageOptions["sortBy"] =
    filters.sort === "low" || filters.sort === "high"
      ? "price"
      : filters.sort === "rating"
        ? "rating"
        : "discountPercentage";
  const order = filters.sort === "low" ? "asc" : "desc";
  const seen = new Set<number>();
  let offline = false;
  let started = false;
  let busy = false;
  const query = filters.query?.trim().toLowerCase() ?? "";
  async function fill(source: Source, signal?: AbortSignal) {
    if (source.queue.length || source.exhausted) return;
    // Start grouped sources with one item each, then replenish only as needed.
    const limit = sources.length > 1 && source.skip === 0 ? 1 : PAGE_SIZE;
    const page = await getProductPage(
      {
        limit,
        skip: source.skip,
        category: source.category,
        query: source.category ? undefined : query,
        sortBy,
        order,
      },
      signal,
    );
    signal?.throwIfAborted();
    source.queue = page.products;
    source.skip += page.products.length;
    source.total = page.total;
    source.exhausted = source.skip >= page.total || !page.products.length;
    offline ||= page.offline;
  }
  const matches = (product: Product) =>
    product.price <= (filters.maxPrice ?? Infinity) &&
    product.rating >= (filters.rating ?? 0) &&
    (!filters.offers || product.discountPercentage >= 15) &&
    (!query ||
      !slugs.length ||
      `${product.title} ${product.brand ?? ""} ${product.description} ${product.category} ${categoryLabel(product.category)}`
        .toLowerCase()
        .includes(query));
  return {
    async next(signal?: AbortSignal) {
      if (busy) throw new Error("Aguarde o carregamento atual.");
      busy = true;
      const snapshot = sources.map((source) => ({
        ...source,
        queue: [...source.queue],
      }));
      const previousSeen = new Set(seen);
      try {
        const results: Product[] = [];
        while (results.length < PAGE_SIZE) {
          const outcomes = await Promise.allSettled(
            sources.map((source) => fill(source, signal)),
          );
          const failure = outcomes.find(
            (outcome) => outcome.status === "rejected",
          );
          if (failure?.status === "rejected") throw failure.reason;
          signal?.throwIfAborted();
          started = true;
          const candidates = sources.filter((source) => source.queue.length);
          if (!candidates.length) break;
          candidates.sort(
            (a, b) =>
              (order === "asc" ? 1 : -1) *
              (a.queue[0][sortBy] - b.queue[0][sortBy]),
          );
          const product = candidates[0].queue.shift()!;
          // Discount stream is descending: later products cannot qualify as offers.
          if (
            filters.offers &&
            sortBy === "discountPercentage" &&
            product.discountPercentage < 15
          ) {
            sources.forEach((source) => {
              source.queue = [];
              source.exhausted = true;
            });
            break;
          }
          if (matches(product) && !seen.has(product.id)) {
            results.push(product);
            seen.add(product.id);
          }
        }
        return {
          products: results,
          hasMore: sources.some(
            (source) => source.queue.length || !source.exhausted,
          ),
          offline,
          total: started
            ? sources.reduce((sum, source) => sum + source.total, 0)
            : 0,
        };
      } catch (error) {
        sources.forEach((source, index) =>
          Object.assign(source, snapshot[index]),
        );
        seen.clear();
        previousSeen.forEach((id) => seen.add(id));
        throw error;
      } finally {
        busy = false;
      }
    },
  };
}
