import type { Product, ProductResponse } from "../types/product";
const API_URL = "https://dummyjson.com";
let fallbackCatalog: Promise<Product[]> | undefined;
async function getFallbackCatalog(signal?: AbortSignal): Promise<Product[]> {
  fallbackCatalog ??= fetch("/assets/products.json")
    .then(async (response) => {
      if (!response.ok) throw new Error("Catálogo de segurança indisponível.");
      return ((await response.json()) as ProductResponse).products;
    })
    .catch((error) => {
      fallbackCatalog = undefined;
      throw error;
    });
  const products = await fallbackCatalog;
  signal?.throwIfAborted();
  return products;
}
function requestSignal(signal?: AbortSignal) {
  return signal
    ? AbortSignal.any([signal, AbortSignal.timeout(12000)])
    : AbortSignal.timeout(12000);
}
export interface PageOptions {
  limit: number;
  skip: number;
  category?: string;
  query?: string;
  sortBy: "price" | "rating" | "discountPercentage";
  order: "asc" | "desc";
}
export interface ProductPageResult extends ProductResponse {
  offline: boolean;
}
export async function getProductPage(
  options: PageOptions,
  signal?: AbortSignal,
): Promise<ProductPageResult> {
  const { limit, skip, category, query, sortBy, order } = options;
  const path = category
    ? `/products/category/${encodeURIComponent(category)}`
    : query
      ? "/products/search"
      : "/products";
  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
    sortBy,
    order,
  });
  if (query && !category) params.set("q", query);
  try {
    const response = await fetch(`${API_URL}${path}?${params}`, {
      signal: requestSignal(signal),
    });
    if (!response.ok) throw new Error("Não foi possível carregar os produtos.");
    const data = (await response.json()) as ProductResponse;
    if (!Array.isArray(data.products) || typeof data.total !== "number")
      throw new Error("Resposta inválida.");
    return { ...data, offline: false };
  } catch (error) {
    if (signal?.aborted) throw error;
    const catalog = await getFallbackCatalog(signal);
    const matching = catalog.filter(
      (product) =>
        (!category || product.category === category) &&
        (!query ||
          category ||
          `${product.title} ${product.description}`
            .toLowerCase()
            .includes(query.toLowerCase())),
    );
    matching.sort(
      (a, b) => (order === "asc" ? 1 : -1) * (a[sortBy] - b[sortBy]),
    );
    return {
      products: matching.slice(skip, skip + limit),
      total: matching.length,
      skip,
      limit,
      offline: true,
    };
  }
}
export async function getProduct(
  id: number,
  signal?: AbortSignal,
): Promise<{ product: Product; offline: boolean }> {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      signal: requestSignal(signal),
    });
    if (!response.ok) throw new Error("Produto não encontrado.");
    const product = (await response.json()) as Product;
    if (typeof product.id !== "number") throw new Error("Produto inválido.");
    return { product, offline: false };
  } catch (error) {
    if (signal?.aborted) throw error;
    const product = (await getFallbackCatalog(signal)).find(
      (item) => item.id === id,
    );
    if (!product) throw new Error("Produto não encontrado.");
    return { product, offline: true };
  }
}
export const FEATURED_IDS = [101, 10, 78, 47, 100, 8, 82, 103];
export async function getFeaturedProducts(signal?: AbortSignal) {
  const results = await Promise.all(
    FEATURED_IDS.map((id) => getProduct(id, signal)),
  );
  return {
    products: results.map((result) => result.product),
    offline: results.some((result) => result.offline),
  };
}
