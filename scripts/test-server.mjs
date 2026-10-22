import assert from "node:assert/strict";
import { createServer } from "node:http";
import { handleApi } from "../server/api.mjs";
import { quoteShipping } from "../server/services/shipping.mjs";
const realFetch = globalThis.fetch;
const upstreamProduct = {
  id: 101,
  title: "Product",
  description: "Demo",
  category: "mobile-accessories",
  price: 25,
  discountPercentage: 10,
  rating: 4,
  stock: 10,
  brand: "Demo",
  thumbnail: "https://cdn.dummyjson.com/product.png",
  images: ["https://cdn.dummyjson.com/product.png"],
  reviews: [],
};
const requests = [];
globalThis.fetch = async (url, options) => {
  requests.push({ url: String(url), options });
  if (String(url).includes("shipment/calculate"))
    return Response.json([
      {
        id: 1,
        name: "PAC",
        company: { name: "Correios" },
        custom_price: "21.50",
        price: "25.00",
        custom_delivery_time: 4,
        delivery_time: 5,
      },
      { id: 2, error: "Unavailable" },
    ]);
  if (String(url).includes("/products/101"))
    return Response.json(upstreamProduct);
  if (String(url).includes("/products?"))
    return Response.json({
      products: [upstreamProduct],
      total: 1,
      skip: 0,
      limit: 12,
    });
  if (String(url).includes("viacep"))
    return Response.json({
      cep: "01001-000",
      logradouro: "Praça da Sé",
      bairro: "Sé",
      localidade: "São Paulo",
      uf: "SP",
    });
  throw Error("Unexpected upstream");
};
const server = createServer((req, res) => {
  handleApi(req, res).then((handled) => {
    if (!handled) {
      res.writeHead(404);
      res.end();
    }
  });
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}`;
try {
  let response = await realFetch(
    `${base}/api/catalog/products?limit=12&skip=0`,
  );
  assert.equal(response.status, 200);
  let data = await response.json();
  assert.equal(
    data.products[0].thumbnail,
    "/api/catalog/products/101/thumbnail",
  );
  assert(!JSON.stringify(data).includes("dummyjson.com"));
  response = await realFetch(`${base}/api/catalog/products?limit=0`);
  assert.equal(response.status, 400);
  response = await realFetch(`${base}/api/address/01001000`);
  data = await response.json();
  assert.equal(data.city, "São Paulo");
  assert(!("provider" in data));
  response = await realFetch(`${base}/api/shipping/quote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cep: "01001000",
      items: [{ id: 101, quantity: 1 }],
    }),
  });
  assert.equal(response.status, 503);
  data = await response.json();
  assert.equal(data.code, "shipping_not_configured");
  assert(!JSON.stringify(data).includes("token"));
  console.log(
    "PASS: same-origin catalog/address routes, upstream URL sanitization and explicit unconfigured freight.",
  );
  const settings = {
    token: "test-only-credential",
    originCep: "01001000",
    userAgent: "Integration test (test@example.com)",
    sandbox: true,
  };
  const quote = await quoteShipping(
    { cep: "20040002", items: [{ id: 101, quantity: 2 }] },
    settings,
    async () => ({
      101: {
        width: 20,
        height: 10,
        length: 25,
        weight: 1,
        insurance_value: 100,
      },
    }),
  );
  assert.equal(quote.options.length, 1);
  assert.equal(quote.options[0].price, 21.5);
  assert.equal(quote.options[0].days, 4);
  assert.equal(quote.sandbox, true);
  assert(!JSON.stringify(quote).includes(settings.token));
  const sent = JSON.parse(requests.at(-1).options.body);
  assert.equal(sent.products[0].quantity, 2);
  assert.equal(sent.products[0].weight, 1);
  assert.equal(sent.from.postal_code, "01001000");
  await assert.rejects(
    quoteShipping(
      { cep: "20040002", items: [{ id: 101, quantity: 1 }] },
      settings,
      async () => ({}),
    ),
    (error) => error.code === "packages_not_configured",
  );
  await assert.rejects(
    quoteShipping(
      { cep: "20040002", items: [{ id: 101, quantity: -1 }] },
      settings,
    ),
    (error) => error.status === 400,
  );
  console.log(
    "PASS: freight payload from server configuration, customized price/time, sandbox marking, missing dimensions and invalid quantities.",
  );
} finally {
  globalThis.fetch = realFetch;
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}
