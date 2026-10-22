export const BRAZILIAN_STATES = [
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
] as const;
export interface AddressFields {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}
export interface PostalAddress extends AddressFields {
  cep: string;
  provider: "ViaCEP" | "BrasilAPI";
}
