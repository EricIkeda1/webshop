import assert from "node:assert/strict";
import { transform } from "esbuild";
import { readFile } from "node:fs/promises";
const source = await readFile(
  new URL("../src/utils/carousel.ts", import.meta.url),
  "utf8",
);
const { code } = await transform(source, { loader: "ts", format: "esm" });
const { carouselPages } = await import(
  `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`
);
assert.deepEqual(
  carouselPages([12, 182, 352, 522, 692, 862, 1032, 1202], 330, 1350),
  [0, 340, 680, 1020],
);
assert.deepEqual(
  carouselPages([0, 170, 340, 510, 680], 330, 840),
  [0, 340, 510],
);
assert.deepEqual(
  carouselPages([0, 300, 600, 900, 1200, 1500, 1800, 2100], 1180, 2380),
  [0, 1200],
);
assert.deepEqual(carouselPages([0, 170], 330, 330), [0]);
assert.deepEqual(carouselPages([], 330, 330), [0]);
console.log(
  "PASS: mobile/desktop carousel groups, partial last page and non-overflowing rails.",
);
