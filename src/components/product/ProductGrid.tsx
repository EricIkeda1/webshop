import type { Product } from "../../types/product";
import ProductCard from "./ProductCard";
import EmptyState from "../ui/EmptyState";
export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="products">
      {products.length ? (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <EmptyState
          title="Nenhum produto por aqui"
          description="Tente outra busca ou selecione uma categoria diferente."
          icon="search"
        />
      )}
    </div>
  );
}
