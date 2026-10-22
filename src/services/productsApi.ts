import type { Product, ProductResponse } from "../types/product";
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
  const params = new URLSearchParams({
    limit: String(options.limit),
    skip: String(options.skip),
    sortBy: options.sortBy,
    order: options.order,
  });
  if (options.category) params.set("category", options.category);
  if (options.query && !options.category) params.set("q", options.query);
  const response = await fetch(`/api/catalog/products?${params}`, { signal });
  if (!response.ok) throw new Error("Não foi possível consultar os produtos.");
  const data = (await response.json()) as ProductPageResult;
  return { ...data, offline: Boolean(data.offline) };
}
export async function getProduct(
  id: number,
  signal?: AbortSignal,
): Promise<{ product: Product; offline: boolean }> {
  const response = await fetch(`/api/catalog/products/${id}`, { signal });
  if (!response.ok) throw new Error("Produto não encontrado.");
  return response.json();
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
