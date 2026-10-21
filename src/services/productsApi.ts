import type { Product, ProductResponse } from "../types/product";
const API_URL = "https://dummyjson.com";
async function parseProducts(response: Response): Promise<Product[]> {
  if (!response.ok) throw new Error("Não foi possível carregar o catálogo.");
  const data = (await response.json()) as ProductResponse;
  if (!Array.isArray(data.products) || !data.products.length)
    throw new Error("Catálogo indisponível.");
  return data.products;
}
export async function getProducts(
  signal?: AbortSignal,
): Promise<{ products: Product[]; offline: boolean }> {
  try {
    const requestSignal = signal
      ? AbortSignal.any([signal, AbortSignal.timeout(12000)])
      : AbortSignal.timeout(12000);
    const products = await parseProducts(
      await fetch(`${API_URL}/products?limit=0`, { signal: requestSignal }),
    );
    return { products, offline: false };
  } catch (error) {
    if (signal?.aborted) throw error;
    const products = await parseProducts(
      await fetch("/assets/products.json", { signal }),
    );
    return { products, offline: true };
  }
}
