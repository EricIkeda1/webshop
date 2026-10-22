/** Local demo order IDs also work on HTTP previews where randomUUID is absent. */
export function createOrderId(
  source: Pick<Crypto, "getRandomValues"> | undefined = globalThis.crypto,
  now = Date.now(),
) {
  const values = new Uint32Array(2);
  const suffix =
    typeof source?.getRandomValues === "function"
      ? Array.from(source.getRandomValues(values), (value) =>
          value.toString(16).padStart(8, "0"),
        ).join("")
      : Math.random().toString(36).slice(2, 12);
  return `EYI-${now.toString(36)}-${suffix}`.toUpperCase();
}
