import { readFile } from "node:fs/promises";
const directory = new URL("../data/product-images/", import.meta.url);
let manifest;
/** Only serve an exact, trusted source captured by the bundled snapshot. */
export async function readBundledImage(product, kind, index = 0) {
  manifest ??= readFile(new URL("manifest.json", directory), "utf8")
    .then(JSON.parse)
    .catch(() => ({}));
  const entry = (await manifest)[
    `${product.id}/${kind === "thumbnail" ? kind : `image-${index}`}`
  ];
  const source =
    kind === "thumbnail" ? product.thumbnail : product.images[index];
  if (
    !entry ||
    entry.source !== source ||
    !/^\d+-(thumbnail|image-\d+)\.webp$/.test(entry.file)
  )
    return null;
  try {
    const bytes = await readFile(new URL(entry.file, directory));
    if (!bytes.length || bytes.length > 8 * 1024 * 1024) return null;
    return { bytes, type: "image/webp" };
  } catch {
    return null;
  }
}
