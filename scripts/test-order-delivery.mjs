import assert from "node:assert/strict";
import { build } from "esbuild";
const compiled = await build({
  entryPoints: [
    new URL("../src/utils/orderDelivery.ts", import.meta.url).pathname,
  ],
  bundle: true,
  format: "esm",
  platform: "node",
  write: false,
});
const { orderDelivery } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString("base64")}`
);
const cart = [{ product: { id: 78 }, quantity: 1 }];
const now = 1000;
const selection = {
  cep: "01001000",
  cartKey: "78:1",
  sandbox: true,
  option: { price: 21.5, expiresAt: 2000 },
};
assert.deepEqual(orderDelivery(null, cart, "01001000", now), {
  shipping: 0,
  shippingQuoted: false,
  shippingSandbox: false,
});
assert.deepEqual(orderDelivery(selection, cart, "01001-000", now), {
  shipping: 21.5,
  shippingQuoted: true,
  shippingSandbox: true,
});
assert.equal(
  orderDelivery(selection, cart, "01001000", 2000).shippingQuoted,
  false,
);
assert.equal(
  orderDelivery(selection, cart, "86200000", now).shippingQuoted,
  false,
);
assert.equal(
  orderDelivery(
    selection,
    [{ product: { id: 78 }, quantity: 2 }],
    "01001000",
    now,
  ).shippingQuoted,
  false,
);
const free = orderDelivery(
  { ...selection, option: { price: 0, expiresAt: 2000 } },
  cart,
  "01001000",
  now,
);
assert.equal(free.shippingQuoted, true);
assert.equal(free.shipping, 0);
console.log(
  "PASS: demo without shipping, valid quote, expired/stale quote and quoted zero-cost shipping remain distinct.",
);

const idModule = await build({
  entryPoints: [new URL("../src/utils/orderId.ts", import.meta.url).pathname],
  bundle: true,
  format: "esm",
  platform: "node",
  write: false,
});
const { createOrderId } = await import(
  `data:text/javascript;base64,${Buffer.from(idModule.outputFiles[0].text).toString("base64")}`
);
const httpCrypto = {
  getRandomValues(values) {
    values[0] = 123;
    values[1] = 456;
    return values;
  },
};
assert.match(
  createOrderId(httpCrypto, 1000),
  /^EYI-[A-Z0-9]+-0000007B000001C8$/,
);
assert.notEqual(
  createOrderId(httpCrypto, 1000),
  createOrderId(httpCrypto, 1001),
);
assert.match(createOrderId({}, 1000), /^EYI-[A-Z0-9]+-[A-Z0-9]+$/);
console.log(
  "PASS: demo order IDs work without randomUUID and without a crypto provider.",
);
