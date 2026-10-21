import { Link } from "react-router-dom";
import { useProductLookup } from "../hooks/useProductLookup";
import { useStore } from "../contexts/StoreContext";
import ProductGrid from "../components/product/ProductGrid";
import EmptyState from "../components/ui/EmptyState";
export default function FavoritesPage() {
  const { favorites, products } = useStore();
  const lookup = useProductLookup(favorites);
  const selected = products.filter((product) => favorites.includes(product.id));
  return (
    <section className="page">
      <div className="breadcrumb">
        <Link to="/">Início</Link> / Favoritos
      </div>
      <div className="section-head">
        <div>
          <h2>
            Meus favoritos <span className="link">({selected.length})</span>
          </h2>
          <p>Gostou? Guarde para depois.</p>
        </div>
      </div>
      {lookup.loading ? (
        <div className="loading" role="status">
          Carregando favoritos…
        </div>
      ) : lookup.error ? (
        <div className="empty">
          <p>{lookup.error}</p>
          <button className="btn" onClick={lookup.retry}>
            Tentar novamente
          </button>
        </div>
      ) : selected.length ? (
        <ProductGrid products={selected} />
      ) : (
        <EmptyState
          title="Seus favoritos moram aqui"
          description="Toque no coração de um produto para salvar suas escolhas."
          icon="heart"
        />
      )}
    </section>
  );
}
