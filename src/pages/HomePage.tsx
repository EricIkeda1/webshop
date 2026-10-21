import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../contexts/StoreContext";
import { categories, inCategory } from "../utils/categories";
import HeroCarousel from "../components/product/HeroCarousel";
import ProductCarousel from "../components/product/ProductCarousel";
import ProductGrid from "../components/product/ProductGrid";
import Icon from "../components/ui/Icon";
export default function HomePage() {
  const { products, notify } = useStore();
  const [category, setCategory] = useState("Todos");
  const featuredIds = [101, 10, 78, 47, 100, 8, 82, 103, 79, 80, 81, 99];
  const featured =
    category === "Todos"
      ? featuredIds.flatMap(
          (id) => products.find((product) => product.id === id) ?? [],
        )
      : products
          .filter((product) => inCategory(product.category, category))
          .slice(0, 12);
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
      <section>
        <div className="section-head">
          <div>
            <h2>Seus próximos favoritos</h2>
            <p>Uma seleção especial. Do seu jeito.</p>
          </div>
          <Link className="link" to="/catalogo">
            Ver todos os produtos
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
            <h2>Achados que valem a pena</h2>
            <p>Favoritos com preços ainda mais especiais.</p>
          </div>
          <Link className="link" to="/ofertas">
            Ver ofertas
          </Link>
        </div>
        <ProductGrid
          products={[...products]
            .sort((a, b) => b.discountPercentage - a.discountPercentage)
            .slice(0, 4)}
        />
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
