import { getProductPage, getProduct } from "./services/catalog.mjs";
import { lookupAddress, PostalLookupError } from "./services/address.mjs";
import { quoteShipping, ShippingError } from "./services/shipping.mjs";
const limits = new Map();
function json(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(JSON.stringify(data));
}
function sanitize(product) {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    category: product.category,
    price: product.price,
    discountPercentage: product.discountPercentage,
    rating: product.rating,
    stock: product.stock,
    brand: product.brand,
    thumbnail: `/api/catalog/products/${product.id}/thumbnail`,
    images: product.images.map(
      (_, i) => `/api/catalog/products/${product.id}/images/${i}`,
    ),
    reviews: product.reviews.map((review) => ({
      rating: review.rating,
      comment: review.comment,
      reviewerName: review.reviewerName,
    })),
  };
}
const cache = new Map();
async function cachedProduct(id) {
  const existing = cache.get(id);
  if (existing && existing.until > Date.now()) return existing.value;
  const value = await getProduct(id);
  if (cache.size >= 400) cache.delete(cache.keys().next().value);
  cache.set(id, { value, until: Date.now() + 5 * 60000 });
  return value;
}
export async function handleApi(req, res) {
  const url = new URL(req.url, "http://localhost");
  if (!url.pathname.startsWith("/api/")) return false;
  const ip = req.socket.remoteAddress || "local",
    now = Date.now();
  let bucket = limits.get(ip);
  if (!bucket || bucket.until < now) {
    bucket = { count: 0, until: now + 60000 };
    if (limits.size > 10000) limits.clear();
    limits.set(ip, bucket);
  }
  if (++bucket.count > 240) {
    json(res, 429, {
      message: "Muitas consultas. Aguarde um minuto e tente novamente.",
    });
    return true;
  }
  try {
    if (req.method === "GET" && url.pathname === "/api/catalog/products") {
      const limit = Number(url.searchParams.get("limit") || 12),
        skip = Number(url.searchParams.get("skip") || 0),
        sortBy = url.searchParams.get("sortBy") || "discountPercentage",
        order = url.searchParams.get("order") || "desc",
        category = url.searchParams.get("category") || undefined,
        query = url.searchParams.get("q") || undefined;
      if (
        !Number.isInteger(limit) ||
        limit < 1 ||
        limit > 12 ||
        !Number.isInteger(skip) ||
        skip < 0 ||
        skip > 10000 ||
        !["price", "rating", "discountPercentage"].includes(sortBy) ||
        !["asc", "desc"].includes(order) ||
        (category && !/^[a-z-]{1,60}$/.test(category)) ||
        (query && query.length > 120)
      ) {
        json(res, 400, { message: "Consulta de produtos inválida." });
        return true;
      }
      const data = await getProductPage({
        limit,
        skip,
        sortBy,
        order,
        category,
        query,
      });
      for (const product of data.products) {
        if (cache.size >= 400) cache.delete(cache.keys().next().value);
        cache.set(product.id, {
          value: { product, offline: data.offline },
          until: now + 300000,
        });
      }
      json(res, 200, { ...data, products: data.products.map(sanitize) });
      return true;
    }
    const productMatch = url.pathname.match(
      /^\/api\/catalog\/products\/(\d{1,6})(?:\/(thumbnail|images)(?:\/(\d{1,2}))?)?$/,
    );
    if (req.method === "GET" && productMatch) {
      const { product, offline } = await cachedProduct(Number(productMatch[1]));
      if (!productMatch[2]) {
        json(res, 200, { product: sanitize(product), offline });
        return true;
      }
      const source =
        productMatch[2] === "thumbnail"
          ? product.thumbnail
          : product.images[Number(productMatch[3])];
      if (!source) {
        json(res, 404, { message: "Imagem não encontrada." });
        return true;
      }
      const imageUrl = new URL(source);
      if (
        imageUrl.protocol !== "https:" ||
        imageUrl.hostname !== "cdn.dummyjson.com"
      ) {
        json(res, 404, { message: "Imagem indisponível." });
        return true;
      }
      const response = await fetch(imageUrl, {
        signal: AbortSignal.timeout(12000),
        redirect: "error",
      });
      const type = response.headers.get("content-type") || "";
      if (!response.ok || !type.startsWith("image/") || type.includes("svg"))
        throw Error();
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length > 8 * 1024 * 1024) throw Error();
      res.writeHead(200, {
        "Content-Type": type,
        "Cache-Control": "public, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      });
      res.end(bytes);
      return true;
    }
    const addressMatch = url.pathname.match(/^\/api\/address\/(\d{8})$/);
    if (req.method === "GET" && addressMatch) {
      const result = await lookupAddress(addressMatch[1]);
      const { provider, ...address } = result;
      json(res, 200, address);
      return true;
    }
    if (req.method === "POST" && url.pathname === "/api/shipping/quote") {
      if (
        req.headers.origin &&
        new URL(req.headers.origin).host !== req.headers.host
      ) {
        json(res, 403, { message: "Origem não permitida." });
        return true;
      }
      if (!(req.headers["content-type"] || "").startsWith("application/json")) {
        json(res, 415, { message: "Formato de solicitação inválido." });
        return true;
      }
      let raw = "";
      for await (const chunk of req) {
        raw += chunk;
        if (Buffer.byteLength(raw) > 16384) {
          json(res, 413, { message: "Solicitação muito grande." });
          return true;
        }
      }
      let body;
      try {
        body = JSON.parse(raw);
      } catch {
        json(res, 400, { message: "Solicitação inválida." });
        return true;
      }
      json(res, 200, await quoteShipping(body));
      return true;
    }
    json(res, 404, { message: "Recurso não encontrado." });
    return true;
  } catch (error) {
    if (error instanceof ShippingError)
      json(res, error.status, { code: error.code, message: error.message });
    else if (error instanceof PostalLookupError)
      json(res, error.kind === "invalid" ? 400 : 422, {
        code: error.kind,
        message: error.message,
      });
    else
      json(res, 502, {
        message: "Serviço temporariamente indisponível. Tente novamente.",
      });
    return true;
  }
}
