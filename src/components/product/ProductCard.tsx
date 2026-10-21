import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import { useStore } from "../../contexts/StoreContext";
import { categoryLabel } from "../../utils/categories";
import { money, originalPrice } from "../../utils/format";
import Icon from "../ui/Icon";
export default function ProductCard({ product: p }: { product: Product }) {
  const { favorites, toggleFavorite, addToCart } = useStore();
  const favorite = favorites.includes(p.id);
  return (
    <article className="product">
      <div className="product-image-wrap">
        <Link
          to={`/produto/${p.id}`}
          className="product-picture"
          aria-label={`Ver ${p.title}`}
        >
          <img src={p.thumbnail} alt={p.title} loading="lazy" />
          <span className="discount">-{Math.round(p.discountPercentage)}%</span>
        </Link>
        <button
          className={`favorite ${favorite ? "on" : ""}`}
          onClick={() => toggleFavorite(p.id)}
          aria-label={
            favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
          }
          aria-pressed={favorite}
        >
          <Icon name="heart" />
        </button>
      </div>
      <div className="product-body">
        <span className="product-category">{categoryLabel(p.category)}</span>
        <Link className="product-title" to={`/produto/${p.id}`}>
          {p.title}
        </Link>
        <div className="rating">
          <span>
            {"★".repeat(Math.round(p.rating))}
            {"☆".repeat(5 - Math.round(p.rating))}
          </span>{" "}
          {p.rating.toFixed(1)} ({p.reviews.length})
        </div>
        <div className="price-old">
          {money(originalPrice(p.price, p.discountPercentage))}
        </div>
        <div className="price">{money(p.price)}</div>
        <div className="installments">
          ou 6x de {money(p.price / 6)} sem juros
        </div>
        <button
          className="btn"
          onClick={() => addToCart(p)}
          disabled={p.stock <= 0}
        >
          <Icon name="bag" />
          {p.stock > 0 ? "Adicionar ao carrinho" : "Indisponível"}
        </button>
      </div>
    </article>
  );
}
