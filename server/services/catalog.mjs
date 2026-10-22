import { readFile } from "node:fs/promises";
const API_URL = "https://dummyjson.com";
let fallbackCatalog;
async function getFallbackCatalog(signal) {
  fallbackCatalog ??= readFile(
    new URL("../data/products.json", import.meta.url),
    "utf8",
  ).then((value) => JSON.parse(value).products);
  const products = await fallbackCatalog;
  signal?.throwIfAborted();
  return products;
}
function requestSignal(signal) {
  return signal
    ? AbortSignal.any([signal, AbortSignal.timeout(12e3)])
    : AbortSignal.timeout(12e3);
}
async function getProductPage(options, signal) {
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
    if (!response.ok)
      throw new Error("N\xE3o foi poss\xEDvel carregar os produtos.");
    const data = await response.json();
    if (!Array.isArray(data.products) || typeof data.total !== "number")
      throw new Error("Resposta inv\xE1lida.");
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
async function getProduct(id, signal) {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      signal: requestSignal(signal),
    });
    if (!response.ok) throw new Error("Produto n\xE3o encontrado.");
    const product = await response.json();
    if (typeof product.id !== "number") throw new Error("Produto inv\xE1lido.");
    return { product, offline: false };
  } catch (error) {
    if (signal?.aborted) throw error;
    const product = (await getFallbackCatalog(signal)).find(
      (item) => item.id === id,
    );
    if (!product) throw new Error("Produto n\xE3o encontrado.");
    return { product, offline: true };
  }
}
const FEATURED_IDS = [101, 10, 78, 47, 100, 8, 82, 103];
async function getFeaturedProducts(signal) {
  const results = await Promise.all(
    FEATURED_IDS.map((id) => getProduct(id, signal)),
  );
  return {
    products: results.map((result) => result.product),
    offline: results.some((result) => result.offline),
  };
}
export { FEATURED_IDS, getFeaturedProducts, getProduct, getProductPage };
