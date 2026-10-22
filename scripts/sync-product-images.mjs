// Run manually to refresh the bundled DummyJSON image snapshot.
import "../server/config/env.mjs";
import { readFile, writeFile, mkdir } from "node:fs/promises";
const directory = new URL("../server/data/product-images/", import.meta.url);
const catalog = JSON.parse(
  await readFile(
    new URL("../server/data/products.json", import.meta.url),
    "utf8",
  ),
).products;
const featured = new Set([101, 10, 78, 47, 100, 8, 82, 103]);
const jobs = catalog.flatMap((product) => [
  { id: product.id, kind: "thumbnail", source: product.thumbnail },
  ...(featured.has(product.id)
    ? product.images.map((source, index) => ({
        id: product.id,
        kind: `image-${index}`,
        source,
      }))
    : []),
]);
await mkdir(directory, { recursive: true });
let previous = {};
try {
  previous = JSON.parse(
    await readFile(new URL("manifest.json", directory), "utf8"),
  );
} catch {}
const manifest = { ...previous };
let done = 0;
let failures = 0;
async function worker() {
  while (jobs.length) {
    const job = jobs.shift();
    const key = `${job.id}/${job.kind}`;
    const file = `${job.id}-${job.kind}.webp`;
    if (manifest[key]?.source === job.source) {
      try {
        await readFile(new URL(file, directory));
        done++;
        continue;
      } catch {}
    }
    try {
      const url = new URL(job.source);
      if (url.protocol !== "https:" || url.hostname !== "cdn.dummyjson.com")
        throw Error("Untrusted image source");
      const response = await fetch(url, {
        signal: AbortSignal.timeout(20000),
        redirect: "error",
      });
      const type = response.headers.get("content-type")?.split(";")[0];
      if (!response.ok || type !== "image/webp")
        throw Error(`Image status ${response.status}, type ${type}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      if (!bytes.length || bytes.length > 8 * 1024 * 1024)
        throw Error("Invalid image size");
      await writeFile(new URL(file, directory), bytes);
      manifest[key] = { source: job.source, file, type };
      done++;
      if (done % 25 === 0) console.log(`Imagens salvas: ${done}`);
    } catch (error) {
      failures++;
      console.error(`Falha em ${key}: ${error.message}`);
    }
  }
}
await Promise.all(Array.from({ length: 6 }, worker));
await writeFile(
  new URL("manifest.json", directory),
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(`${done} imagens disponíveis; ${failures} falhas.`);
if (failures) process.exitCode = 1;
