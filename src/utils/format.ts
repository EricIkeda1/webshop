export const money = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value,
  );
export const originalPrice = (price: number, discount: number) =>
  price / (1 - discount / 100);
