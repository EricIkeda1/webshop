import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { readBundledImage } from "../server/services/productImages.mjs";
import { handleApi } from "../server/api.mjs";
const products = JSON.parse(
  await readFile(
    new URL("../server/data/products.json", import.meta.url),
    "utf8",
  ),
).products;
for (const product of products) {
  const bundled = await readBundledImage(product, "thumbnail");
  assert(bundled, `Missing thumbnail for ${product.id}`);
  assert.equal(bundled.bytes.toString("ascii", 0, 4), "RIFF");
  assert.equal(bundled.bytes.toString("ascii", 8, 12), "WEBP");
}
console.log(
  `PASS: ${products.length} bundled thumbnails contain valid WebP signatures.`,
);
const featured = products.find((p) => p.id === 101);
assert(await readBundledImage(featured, "images", 0));
assert.equal(
  await readBundledImage(
    { ...featured, thumbnail: "https://cdn.dummyjson.com/changed.webp" },
    "thumbnail",
  ),
  null,
);
assert.equal(await readBundledImage(featured, "images", 99), null);
console.log(
  "PASS: source changes and unknown indexes never return a mismatched snapshot.",
);
const realFetch = globalThis.fetch;
const calls = [];
globalThis.fetch = async (url) => {
  calls.push(String(url));
  throw Error("Simulated upstream outage");
};
const server = createServer((req, res) => handleApi(req, res));
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
try {
  const base = `http://127.0.0.1:${server.address().port}`;
  for (const suffix of ["thumbnail", "images/0"]) {
    const response = await realFetch(
      `${base}/api/catalog/products/101/${suffix}`,
    );
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "image/webp");
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  }
  assert(!calls.some((url) => url.includes("cdn.dummyjson.com")));
  assert.equal(
    (await realFetch(`${base}/api/catalog/products/101/images/99`)).status,
    404,
  );
  console.log(
    "PASS: thumbnail and hero image work during upstream failure; unknown index returns 404.",
  );
} finally {
  globalThis.fetch = realFetch;
  await new Promise((resolve) => server.close(resolve));
}
