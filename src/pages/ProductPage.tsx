import ProductImage from "../components/ui/ProductImage";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProductLookup } from "../hooks/useProductLookup";
import { useStore } from "../contexts/StoreContext";
import { categoryLabel } from "../utils/categories";
import { money, originalPrice } from "../utils/format";
import ProductGrid from "../components/product/ProductGrid";
import QuantitySelector from "../components/ui/QuantitySelector";
import EmptyState from "../components/ui/EmptyState";
import Icon from "../components/ui/Icon";
export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, favorites, addToCart, toggleFavorite } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [image, setImage] = useState(0);
  useEffect(() => {
    setQuantity(1);
    setImage(0);
  }, [id]);
  const lookup = useProductLookup([Number(id)]);
  if (lookup.loading)
    return (
      <div className="loading" role="status">
        Carregando produto…
      </div>
    );
  const product = products.find((item) => item.id === Number(id));
  if (!product)
    return (
      <EmptyState
        title="Produto não encontrado"
        description="Explore os outros produtos do catálogo."
      />
    );
  const images = product.images.length ? product.images : [product.thumbnail];
  return (
    <>
      <div className="breadcrumb">
        <Link to="/">Início</Link> /{" "}
        <Link
          to={`/catalogo?categoria=${encodeURIComponent(categoryLabel(product.category))}`}
        >
          {categoryLabel(product.category)}
        </Link>{" "}
        / {product.title}
      </div>
      <section className="detail">
        <div>
          <ProductImage
            className="detail-main-img"
            src={images[image] ?? images[0]}
            alt={product.title}
          />
          <div className="thumbnails">
            {images.map((source, index) => (
              <button
                key={source}
                className={image === index ? "active" : ""}
                onClick={() => setImage(index)}
                aria-label={`Imagem ${index + 1}`}
              >
                <ProductImage
                  src={source}
                  alt={`${product.title}, vista ${index + 1}`}
                />
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="product-category">
            {categoryLabel(product.category)} / {product.brand ?? "Seleção EYI"}
          </div>
          <h1>{product.title}</h1>
          <div className="rating">
            <span>
              {"★".repeat(Math.round(product.rating))}
              {"☆".repeat(5 - Math.round(product.rating))}
            </span>{" "}
            {product.rating} ({product.reviews.length} avaliações)
          </div>
          <div className="price-old">
            {money(originalPrice(product.price, product.discountPercentage))}
          </div>
          <div className="price">{money(product.price)}</div>
          <div className="installments">
            6x de {money(product.price / 6)} sem juros
          </div>
          <p>{product.description}</p>
          <p className="small-note">Quantidade</p>
          <QuantitySelector
            value={quantity}
            max={product.stock}
            onChange={setQuantity}
          />
          <span className="stock">
            ●{" "}
            {product.stock > 0 ? `${product.stock} em estoque` : "Indisponível"}
          </span>
          <div className="detail-actions">
            <button
              className="btn"
              disabled={!product.stock}
              onClick={() => addToCart(product, quantity)}
            >
              <Icon name="bag" /> Adicionar ao carrinho
            </button>
            <button
              className="btn outline"
              disabled={!product.stock}
              onClick={() => {
                if (addToCart(product, quantity)) navigate("/checkout");
              }}
            >
              Comprar agora
            </button>
            <button
              className="link"
              onClick={() => toggleFavorite(product.id)}
              aria-pressed={favorites.includes(product.id)}
            >
              <Icon name="heart" />{" "}
              {favorites.includes(product.id)
                ? "Remover dos favoritos"
                : "Salvar nos favoritos"}
            </button>
          </div>
          <div className="notice">
            <Icon name="shield" /> Produto demonstrativo. Fotos, descrições e
            estoque da DummyJSON. Valores ilustrativos em reais.
          </div>
        </div>
      </section>
      <section>
        <div className="section-head">
          <h2>Você também pode gostar</h2>
        </div>
        <ProductGrid
          products={products
            .filter(
              (item) =>
                item.category === product.category && item.id !== product.id,
            )
            .slice(0, 4)}
        />
      </section>
    </>
  );
}
