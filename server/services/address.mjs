const BRAZILIAN_STATES = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];
class PostalLookupError extends Error {
  constructor(kind, message) {
    super(message);
    this.kind = kind;
    this.name = "PostalLookupError";
  }
  kind;
}
const normalizeCep = (value) => value.replace(/\D/g, "");
const formatCep = (value) =>
  normalizeCep(value)
    .slice(0, 8)
    .replace(/^(\d{5})(\d)/, "$1-$2");
function text(value) {
  return typeof value === "string" ? value.trim() : "";
}
function validateAddress(data, cep, provider) {
  const address =
    provider === "ViaCEP"
      ? {
          cep: normalizeCep(text(data.cep)),
          street: text(data.logradouro),
          neighborhood: text(data.bairro),
          city: text(data.localidade),
          state: text(data.uf).toUpperCase(),
          provider,
        }
      : {
          cep: normalizeCep(text(data.cep)),
          street: text(data.street),
          neighborhood: text(data.neighborhood),
          city: text(data.city),
          state: text(data.state).toUpperCase(),
          provider,
        };
  if (
    address.cep !== cep ||
    !address.city ||
    !BRAZILIAN_STATES.some((state) => state === address.state)
  )
    throw new PostalLookupError(
      "unavailable",
      "Resposta incompleta da consulta de CEP.",
    );
  return address;
}
async function lookupAddress(value, options = {}) {
  const cep = normalizeCep(value);
  if (!/^\d{8}$/.test(cep))
    throw new PostalLookupError("invalid", "Informe um CEP com 8 d\xEDgitos.");
  options.signal?.throwIfAborted();
  const providers = [
    { name: "ViaCEP", url: `https://viacep.com.br/ws/${cep}/json/` },
    {
      name: "BrasilAPI",
      url: `https://brasilapi.com.br/api/cep/v1/${cep}`,
    },
  ];
  const failures = [];
  for (const provider of providers) {
    try {
      options.signal?.throwIfAborted();
      const timeout = AbortSignal.timeout(options.timeoutMs ?? 4500);
      const signal = options.signal
        ? AbortSignal.any([options.signal, timeout])
        : timeout;
      const response = await fetch(provider.url, {
        signal,
        headers: { Accept: "application/json" },
        referrerPolicy: "no-referrer",
      });
      if (!response.ok)
        throw new PostalLookupError(
          "unavailable",
          "Servi\xE7o de CEP temporariamente indispon\xEDvel.",
        );
      const data = await response.json();
      options.signal?.throwIfAborted();
      if (!data || typeof data !== "object" || Array.isArray(data))
        throw new PostalLookupError(
          "unavailable",
          "Resposta inv\xE1lida do servi\xE7o de CEP.",
        );
      const record = data;
      if (record.erro === true || record.erro === "true")
        throw new PostalLookupError("not-found", "CEP n\xE3o encontrado.");
      return validateAddress(record, cep, provider.name);
    } catch (error) {
      if (options.signal?.aborted) throw options.signal.reason;
      failures.push(error);
    }
  }
  const viaCepNotFound =
    failures[0] instanceof PostalLookupError &&
    failures[0].kind === "not-found";
  throw new PostalLookupError(
    viaCepNotFound ? "not-found" : "unavailable",
    viaCepNotFound
      ? "CEP n\xE3o localizado. Confira os d\xEDgitos ou preencha o endere\xE7o manualmente."
      : "N\xE3o foi poss\xEDvel consultar o CEP agora. Tente novamente ou preencha o endere\xE7o manualmente.",
  );
}
export { PostalLookupError, formatCep, lookupAddress, normalizeCep };
