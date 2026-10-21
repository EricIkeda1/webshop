import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useProductFeed } from "../hooks/useProductFeed";
import LoadMoreProducts from "../components/product/LoadMoreProducts";
import { categories } from "../utils/categories";
import { money } from "../utils/format";
import ProductGrid from "../components/product/ProductGrid";
import Icon from "../components/ui/Icon";
export default function CatalogPage({ offers = false }: { offers?: boolean }) {
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState(40000);
  const [rating, setRating] = useState(0);
  const [sort, setSort] = useState("featured");
  const query = params.get("q") ?? "";
  const category = params.get("categoria") ?? "Todos";
  const feed = useProductFeed({
    query,
    category,
    maxPrice,
    rating,
    sort,
    offers,
  });
  function chooseCategory(value: string) {
    const next = new URLSearchParams(params);
    next.set("categoria", value);
    setParams(next);
  }
  return (
    <>
      <div className="breadcrumb">
        <Link to="/">Início</Link> / {offers ? "Ofertas" : "Catálogo"}
      </div>
      <section className="page">
        <div className="section-head">
          <div>
            <h2>
              {offers
                ? "Ofertas especiais"
                : query
                  ? `Resultados para “${query}”`
                  : category === "Todos"
                    ? "Encontre seu próximo favorito"
                    : category}
            </h2>
            <p>Explore a seleção e toque em Ver mais para continuar.</p>
          </div>
          <select
            className="sort"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label="Ordenar produtos"
          >
            <option value="featured">Mais relevantes</option>
            <option value="low">Menor preço</option>
            <option value="high">Maior preço</option>
            <option value="rating">Melhor avaliação</option>
          </select>
        </div>
        <button
          className="filters-toggle"
          onClick={() => setFilters(!filters)}
          aria-expanded={filters}
        >
          <Icon name="filter" /> Filtrar produtos
        </button>
        <div className="catalog-layout">
          <aside className={`sidebar ${filters ? "open" : ""}`}>
            <h4>Categorias</h4>
            {Object.keys(categories).map((name) => (
              <label key={name}>
                <input
                  type="radio"
                  name="category"
                  checked={category === name}
                  onChange={() => chooseCategory(name)}
                />
                {name}
              </label>
            ))}
            <h4 className="filter-heading">Faixa de preço</h4>
            <label htmlFor="max-price">Até {money(maxPrice)}</label>
            <input
              id="max-price"
              className="full-width"
              type="range"
              min="10"
              max="40000"
              step="10"
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
            />
            <h4 className="filter-heading">Avaliação mínima</h4>
            <select
              className="input"
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
              aria-label="Avaliação mínima"
            >
              {[0, 3, 4, 4.5].map((value) => (
                <option key={value} value={value}>
                  {value ? `${value} estrelas` : "Todas as avaliações"}
                </option>
              ))}
            </select>
            <button
              className="link space-top"
              onClick={() => {
                setMaxPrice(40000);
                setRating(0);
                setSort("featured");
                setParams({});
              }}
            >
              Limpar filtros
            </button>
          </aside>
          <div className="catalog-results" aria-busy={feed.loading}>
            {feed.offline && (
              <div className="notice">
                Catálogo de segurança: a API está indisponível no momento.
              </div>
            )}
            {feed.products.length > 0 && (
              <ProductGrid products={feed.products} />
            )}
            <LoadMoreProducts
              loading={feed.loading}
              hasMore={feed.hasMore}
              count={feed.products.length}
              error={feed.error}
              onLoadMore={feed.loadMore}
            />
          </div>
        </div>
      </section>
    </>
  );
}
