export const categories: Record<string, string[]> = {
  Todos: [],
  Tecnologia: ["laptops", "smartphones", "mobile-accessories", "tablets"],
  Beleza: ["beauty", "fragrances", "skin-care"],
  "Casa e decoração": ["furniture", "home-decoration", "kitchen-accessories"],
  Moda: [
    "mens-shirts",
    "mens-shoes",
    "mens-watches",
    "womens-dresses",
    "womens-bags",
    "womens-jewellery",
    "womens-shoes",
    "womens-watches",
    "tops",
    "sunglasses",
  ],
};
export const categoryLabel = (slug: string) =>
  Object.keys(categories).find((key) => categories[key].includes(slug)) ??
  "Essenciais";
export const inCategory = (slug: string, category: string) =>
  category === "Todos" || !!categories[category]?.includes(slug);
