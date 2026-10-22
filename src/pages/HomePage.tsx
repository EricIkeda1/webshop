import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../contexts/StoreContext";
import { categories } from "../utils/categories";
import HeroCarousel from "../components/product/HeroCarousel";
import ProductCarousel from "../components/product/ProductCarousel";
import ProductGrid from "../components/product/ProductGrid";
import { useProductFeed } from "../hooks/useProductFeed";
import LoadMoreProducts from "../components/product/LoadMoreProducts";
import Icon from "../components/ui/Icon";
export default function HomePage() {
  const { products, notify } = useStore();
  const [category, setCategory] = useState("Todos");
  const featuredIds = [101, 10, 78, 47, 100, 8, 82, 103, 79, 80, 81, 99];
  const featured = featuredIds.flatMap(
    (id) => products.find((product) => product.id === id) ?? [],
  );
  const feed = useProductFeed({ category });
  return (
    <>
      <HeroCarousel />
      <div className="benefits">
        {[
          ["truck", "Entrega para todo o Brasil", "Simule o frete no carrinho"],
          ["shield", "Compra tranquila", "Uma experiência simples e segura"],
          ["card", "Até 6x sem juros", "Mais liberdade para escolher"],
          ["headset", "Estamos por aqui", "Encontre respostas na central"],
        ].map(([icon, title, text]) => (
          <div className="benefit" key={icon}>
            <Icon name={icon} />
            <div>
              <b>{title}</b>
              <small>{text}</small>
            </div>
          </div>
        ))}
      </div>
      <button
        className="discover-below"
        onClick={() =>
          document.getElementById("home-products")?.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
              .matches
              ? "instant"
              : "smooth",
            block: "start",
          })
        }
      >
        <span>Tem mais para descobrir</span>
        <span className="discover-chevron" aria-hidden="true" />
      </button>
      <section id="home-products" className="home-products">
        <div className="section-head">
          <div>
            <h2>Seus próximos favoritos</h2>
            <p>Uma seleção especial. Do seu jeito.</p>
          </div>
          <Link className="link" to="/catalogo">
            Ver todos os produtos
          </Link>
        </div>
        <ProductCarousel products={featured} />
      </section>
      <section className="editorial">
        {[
          {
            category: "Tecnologia",
            eyebrow: "TECNOLOGIA QUE CONECTA",
            title: (
              <>
                Seu mundo.
                <br />
                Em outra frequência.
              </>
            ),
            link: "Encontre seu próximo upgrade",
            id: 100,
          },
          {
            category: "Beleza",
            eyebrow: "BELEZA EM CADA DETALHE",
            title: (
              <>
                Um toque de você.
                <br />
                Todos os dias.
              </>
            ),
            link: "Explore a seleção de beleza",
            id: 10,
          },
        ].map((promo) => (
          <div className="promo" key={promo.id}>
            <div className="eyebrow">{promo.eyebrow}</div>
            <h3>{promo.title}</h3>
            <Link className="link" to={`/catalogo?categoria=${promo.category}`}>
              {promo.link}
            </Link>
            <img
              src={
                products.find((product) => product.id === promo.id)?.thumbnail
              }
              alt={promo.category}
              loading="lazy"
            />
          </div>
        ))}
      </section>
      <section>
        <div className="section-head">
          <div>
            <h2>Mais escolhas para você</h2>
            <p>Descubra aos poucos. Mais 12 produtos a cada clique.</p>
          </div>
          <Link className="link" to="/ofertas">
            Ver ofertas
          </Link>
        </div>
        <div className="tabs">
          {Object.keys(categories).map((name) => (
            <button
              key={name}
              className={category === name ? "active" : ""}
              onClick={() => setCategory(name)}
            >
              {name}
            </button>
          ))}
        </div>
        <div aria-busy={feed.loading}>
          {feed.offline && (
            <div className="notice">
              Catálogo de segurança: a API está indisponível no momento.
            </div>
          )}
          {feed.products.length > 0 && <ProductGrid products={feed.products} />}
          <LoadMoreProducts
            loading={feed.loading}
            hasMore={feed.hasMore}
            count={feed.products.length}
            error={feed.error}
            onLoadMore={feed.loadMore}
          />
        </div>
      </section>
      <div className="newsletter">
        <div>
          <h3>Entre para a lista dos favoritos.</h3>
          <p>Descubra novidades e seleções que combinam com você.</p>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            notify("Demonstração concluída! Seu e-mail não foi cadastrado.");
            event.currentTarget.reset();
          }}
        >
          <input
            type="email"
            required
            placeholder="Seu melhor e-mail"
            aria-label="E-mail para novidades"
          />
          <button className="btn">Quero fazer parte</button>
        </form>
      </div>
    </>
  );
}
