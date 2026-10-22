export interface ShippingOption {
  id: string;
  label: string;
  price: number;
  days: number;
  expiresAt: number;
}
export interface ShippingSelection {
  cep: string;
  cartKey: string;
  option: ShippingOption;
  sandbox: boolean;
}
export interface ShippingQuote {
  options: ShippingOption[];
  sandbox: boolean;
}
