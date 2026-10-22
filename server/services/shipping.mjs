import { readFile } from "node:fs/promises";
import { config } from "../config/env.mjs";
export class ShippingError extends Error {
  constructor(code, message, status = 503) {
    super(message);
    this.code = code;
    this.status = status;
  }
}
export async function quoteShipping(
  body,
  settings = config,
  loadPackages = async () =>
    JSON.parse(
      await readFile(
        new URL("../config/shipping-products.json", import.meta.url),
        "utf8",
      ),
    ),
) {
  if (
    !body ||
    !/^\d{8}$/.test(body.cep || "") ||
    !Array.isArray(body.items) ||
    !body.items.length ||
    body.items.length > 50
  )
    throw new ShippingError(
      "invalid_request",
      "Informe um CEP válido e adicione produtos ao carrinho.",
      400,
    );
  if (
    body.items.some(
      (item) =>
        !Number.isInteger(item.id) ||
        item.id < 1 ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 100,
    )
  )
    throw new ShippingError(
      "invalid_request",
      "Os itens do carrinho são inválidos.",
      400,
    );
  if (
    !settings.token ||
    !/^\d{8}$/.test(settings.originCep) ||
    !settings.userAgent
  )
    throw new ShippingError(
      "shipping_not_configured",
      "A consulta de frete real ainda não está configurada.",
    );
  let packages;
  try {
    packages = await loadPackages();
  } catch {
    throw new ShippingError(
      "packages_not_configured",
      "As informações de envio dos produtos ainda não estão cadastradas.",
    );
  }
  const products = body.items.map((item) => {
    const data = packages[String(item.id)];
    if (
      !data ||
      ["width", "height", "length", "weight"].some(
        (key) => !Number.isFinite(data[key]) || data[key] <= 0,
      ) ||
      !Number.isFinite(data.insurance_value) ||
      data.insurance_value < 0
    )
      throw new ShippingError(
        "packages_not_configured",
        "As informações de envio de um ou mais produtos ainda não estão cadastradas.",
      );
    return {
      id: String(item.id),
      width: data.width,
      height: data.height,
      length: data.length,
      weight: data.weight,
      insurance_value: data.insurance_value,
      quantity: item.quantity,
    };
  });
  const base = settings.sandbox
    ? "https://sandbox.melhorenvio.com.br"
    : "https://www.melhorenvio.com.br";
  let response;
  try {
    response = await fetch(`${base}/api/v2/me/shipment/calculate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${settings.token}`,
        "User-Agent": settings.userAgent,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: { postal_code: settings.originCep },
        to: { postal_code: body.cep },
        products,
        options: { receipt: false, own_hand: false },
      }),
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new ShippingError(
      "shipping_unavailable",
      "Não foi possível consultar o frete agora. Tente novamente.",
    );
  }
  if (!response.ok)
    throw new ShippingError(
      "shipping_unavailable",
      "A consulta de frete está temporariamente indisponível.",
    );
  let rows;
  try {
    rows = await response.json();
  } catch {
    throw new ShippingError(
      "shipping_unavailable",
      "Não foi possível ler a cotação de frete.",
    );
  }
  if (!Array.isArray(rows))
    throw new ShippingError(
      "shipping_unavailable",
      "Não foi possível consultar as opções de entrega.",
    );
  const expiresAt = Date.now() + 10 * 60 * 1000;
  const options = rows.flatMap((row) => {
    const rawPrice = row.custom_price ?? row.price,
      rawDays = row.custom_delivery_time ?? row.delivery_time;
    const price = Number(rawPrice),
      days = Number(rawDays);
    if (
      row.error ||
      rawPrice === null ||
      rawPrice === "" ||
      rawDays === null ||
      rawDays === "" ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isFinite(days) ||
      days < 0
    )
      return [];
    return [
      {
        id: String(row.id),
        label: `${row.company?.name || "Transportadora"} · ${row.name || "Entrega"}`,
        price,
        days,
        expiresAt,
      },
    ];
  });
  if (!options.length)
    throw new ShippingError(
      "no_shipping_options",
      "Nenhuma opção de entrega está disponível para esse CEP e esses produtos.",
      422,
    );
  return { options, sandbox: settings.sandbox };
}
