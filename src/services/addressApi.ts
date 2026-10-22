import type { AddressFields } from "../types/address";
export class PostalLookupError extends Error {
  readonly kind: string;
  constructor(kind: string, message: string) {
    super(message);
    this.kind = kind;
    this.name = "PostalLookupError";
  }
}
export const normalizeCep = (value: string) => value.replace(/\D/g, "");
export const formatCep = (value: string) =>
  normalizeCep(value)
    .slice(0, 8)
    .replace(/^(\d{5})(\d)/, "$1-$2");
export async function lookupAddress(
  value: string,
  options: { signal?: AbortSignal } = {},
): Promise<AddressFields & { cep: string }> {
  const cep = normalizeCep(value);
  if (!/^\d{8}$/.test(cep))
    throw new PostalLookupError("invalid", "Informe um CEP com 8 dígitos.");
  const response = await fetch(`/api/address/${cep}`, {
    signal: options.signal,
  });
  const data = await response.json();
  if (!response.ok)
    throw new PostalLookupError(
      data.code || "unavailable",
      data.message || "Não foi possível buscar o endereço.",
    );
  return data;
}
