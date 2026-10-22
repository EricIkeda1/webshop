import assert from "node:assert/strict";
import { build } from "esbuild";
const compiled = await build({
  entryPoints: [
    new URL("../src/services/deliveryEstimate.ts", import.meta.url).pathname,
  ],
  bundle: true,
  format: "esm",
  platform: "node",
  write: false,
});
const { getDeliveryEstimate } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString("base64")}`
);
const originalFetch = globalThis.fetch;
const destination = {
  cep: "86200000",
  street: "",
  neighborhood: "",
  city: "Ibiporã",
  state: "PR",
};
const items = [{ product: { id: 78 }, quantity: 1 }];
try {
  let calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push(String(url));
    if (String(url).startsWith("/api/address/"))
      return Response.json(destination);
    assert.deepEqual(JSON.parse(options.body), {
      cep: "86200000",
      items: [{ id: 78, quantity: 1 }],
    });
    return Response.json(
      { code: "shipping_not_configured", message: "Not configured" },
      { status: 503 },
    );
  };
  let result = await getDeliveryEstimate("86200-000", items);
  assert.equal(result.destination.city, "Ibiporã");
  assert.equal(result.quote, null);
  assert.equal(result.errorCode, "shipping_not_configured");
  assert(result.error.includes("ativada pela loja"));
  assert.deepEqual(calls, ["/api/address/86200000", "/api/shipping/quote"]);
  console.log(
    "PASS: valid general CEP remains visible when real shipping is unconfigured; no price is invented.",
  );
  calls = [];
  globalThis.fetch = async (url) => {
    calls.push(url);
    return Response.json(
      { code: "not-found", message: "CEP não encontrado." },
      { status: 422 },
    );
  };
  await assert.rejects(
    getDeliveryEstimate("99999999", items),
    /CEP não encontrado/,
  );
  assert.equal(calls.length, 1);
  await assert.rejects(getDeliveryEstimate("123", items), /8 dígitos/);
  assert.equal(calls.length, 1);
  console.log(
    "PASS: malformed and nonexistent CEPs do not request a shipping quote.",
  );
  const quote = {
    sandbox: true,
    options: [
      {
        id: "1",
        label: "Test carrier",
        price: 21.5,
        days: 4,
        expiresAt: Date.now() + 600000,
      },
    ],
  };
  globalThis.fetch = async (url) =>
    String(url).startsWith("/api/address/")
      ? Response.json(
          { code: "unavailable", message: "Unavailable" },
          { status: 422 },
        )
      : Response.json(quote);
  result = await getDeliveryEstimate("86200000", items);
  assert.equal(result.destination, null);
  assert(result.addressWarning);
  assert.equal(result.quote.options[0].price, 21.5);
  console.log(
    "PASS: address-provider outage does not block an available carrier quote.",
  );
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(
    getDeliveryEstimate("86200000", items, controller.signal),
    { name: "AbortError" },
  );
  globalThis.fetch = async (url) =>
    String(url).startsWith("/api/address/")
      ? Response.json(destination)
      : new Response("<html>Deployment error</html>", { status: 500 });
  result = await getDeliveryEstimate("86200000", items);
  assert.equal(result.destination.city, "Ibiporã");
  assert(result.error.includes("não respondeu corretamente"));
  console.log(
    "PASS: cancellation and non-JSON deployment errors are handled without losing a resolved address.",
  );
} finally {
  globalThis.fetch = originalFetch;
}
