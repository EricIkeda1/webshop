import { build } from "esbuild";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const temp = await mkdtemp(join(tmpdir(), "eyi-address-"));
const originalFetch = globalThis.fetch;
const via = {
  cep: "01001-000",
  logradouro: "Praça da Sé",
  bairro: "Sé",
  localidade: "São Paulo",
  uf: "SP",
};
const brasil = {
  cep: "01001000",
  street: "Praça da Sé",
  neighborhood: "Sé",
  city: "São Paulo",
  state: "SP",
};
let calls = [];
let handler;
globalThis.fetch = async (url, options) => {
  calls.push({ url, options });
  options?.signal?.throwIfAborted();
  return handler(url, options);
};
try {
  const file = join(temp, "address.mjs");
  await build({
    entryPoints: ["server/services/address.mjs"],
    outfile: file,
    bundle: true,
    platform: "node",
    format: "esm",
    logLevel: "silent",
  });
  const { lookupAddress, formatCep } = await import(pathToFileURL(file).href);
  assert.equal(formatCep("01001000"), "01001-000");
  handler = () => Response.json(via);
  let address = await lookupAddress("01001-000");
  assert.equal(address.provider, "ViaCEP");
  assert.equal(address.street, "Praça da Sé");
  assert.equal(address.state, "SP");
  assert.equal(calls.length, 1);
  console.log(
    "PASS: ViaCEP fields normalize correctly; fallback is not called on success.",
  );
  for (const failure of [
    () => {
      throw new TypeError("Network error");
    },
    () => new Response("", { status: 503 }),
    () => new Response("not json"),
    () => Response.json({ erro: true }),
    () => Response.json({ ...via, cep: "20040-002" }),
    () => Response.json({ ...via, uf: "" }),
  ]) {
    calls = [];
    handler = (url) =>
      url.includes("viacep.com.br") ? failure() : Response.json(brasil);
    address = await lookupAddress("01001000");
    assert.equal(address.provider, "BrasilAPI");
    assert.equal(address.city, "São Paulo");
    assert.equal(calls.length, 2);
    assert.equal(calls[1].url, "https://brasilapi.com.br/api/cep/v1/01001000");
    assert.equal(calls[1].options.referrerPolicy, "no-referrer");
    assert.equal(calls[1].options.body, undefined);
  }
  console.log(
    "PASS: fallback on network, HTTP, JSON, missing CEP, mismatched CEP and invalid address.",
  );
  calls = [];
  handler = (url, options) =>
    url.includes("viacep.com.br")
      ? new Promise((_, reject) => {
          options.signal.addEventListener(
            "abort",
            () => reject(options.signal.reason),
            { once: true },
          );
        })
      : Response.json(brasil);
  const keepAlive = setTimeout(() => {}, 1000);
  try {
    address = await lookupAddress("01001000", { timeoutMs: 10 });
  } finally {
    clearTimeout(keepAlive);
  }
  assert.equal(address.provider, "BrasilAPI");
  assert.equal(calls.length, 2);
  console.log("PASS: provider timeout triggers the fallback.");
  calls = [];
  handler = () => {
    throw new Error("Both services down");
  };
  await assert.rejects(
    lookupAddress("01001000"),
    (error) =>
      error.kind === "unavailable" && error.message.includes("manualmente"),
  );
  assert.equal(calls.length, 2);
  console.log(
    "PASS: both services down returns actionable manual-entry message.",
  );
  calls = [];
  await assert.rejects(
    lookupAddress("12345"),
    (error) => error.kind === "invalid",
  );
  assert.equal(calls.length, 0);
  console.log("PASS: invalid postal codes do not reach external APIs.");
  calls = [];
  handler = () => Response.json({ ...via, logradouro: "", bairro: "" });
  address = await lookupAddress("01001000");
  assert.equal(address.street, "");
  assert.equal(address.city, "São Paulo");
  assert.equal(calls.length, 1);
  console.log(
    "PASS: general municipality CEP accepts manual street and neighborhood.",
  );
  calls = [];
  const controller = new AbortController();
  handler = (_, options) =>
    new Promise((_, reject) => {
      options.signal.addEventListener(
        "abort",
        () => reject(options.signal.reason),
        { once: true },
      );
    });
  const pending = lookupAddress("01001000", { signal: controller.signal });
  controller.abort();
  await assert.rejects(pending, (error) => error.name === "AbortError");
  assert.equal(calls.length, 1);
  console.log(
    "PASS: cancellation does not trigger another provider or return a stale address.",
  );
} finally {
  globalThis.fetch = originalFetch;
  await rm(temp, { recursive: true, force: true });
}
