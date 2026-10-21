import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../../contexts/StoreContext";
import { categories } from "../../utils/categories";
import { money } from "../../utils/format";
import Brand from "./Brand";
import Icon from "../ui/Icon";
export default function Header() {
  const { count, subtotal } = useStore();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [menu, setMenu] = useState(false);
  function choose(category: string) {
    setMenu(false);
    navigate(`/catalogo?categoria=${encodeURIComponent(category)}`);
  }
  return (
    <>
      <div className="topline">
        Seu próximo favorito está aqui. <span>•</span> Use EYI10 e ganhe 10% na
        sua compra demonstrativa
      </div>
      <header className="header">
        <div className="wrap header-inner">
          <button
            className="hamburger"
            onClick={() => setMenu(!menu)}
            aria-label="Abrir menu"
            aria-expanded={menu}
          >
            <Icon name="menu" />
          </button>
          <Brand />
          <form
            className="search"
            role="search"
            key={params.get("q") ?? ""}
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              navigate(
                `/catalogo?q=${encodeURIComponent(String(data.get("q") ?? "").trim())}`,
              );
              setMenu(false);
            }}
          >
            <Icon name="search" />
            <input
              name="q"
              type="search"
              defaultValue={params.get("q") ?? ""}
              placeholder="O que você procura hoje?"
              aria-label="Buscar produtos"
            />
            <button aria-label="Buscar">
              <Icon name="arrow" />
            </button>
          </form>
          <div className="header-actions">
            <button onClick={() => navigate("/conta")}>
              <Icon name="user" />
              <div>
                <small>Bem-vindo à EYI</small>
                <strong>Minha conta</strong>
              </div>
            </button>
            <button
              onClick={() => navigate("/favoritos")}
              aria-label="Favoritos"
            >
              <Icon name="heart" />
              <div>
                <small>Seus escolhidos</small>
                <strong>Favoritos</strong>
              </div>
            </button>
            <button
              onClick={() => navigate("/carrinho")}
              aria-label={`Carrinho, ${count} itens`}
            >
              <Icon name="bag" />
              {count > 0 && <span className="count">{count}</span>}
              <div>
                <small>Meu carrinho</small>
                <strong>{money(subtotal)}</strong>
              </div>
            </button>
          </div>
        </div>
      </header>
      <nav className="nav">
        <div className="wrap nav-inner">
          <button onClick={() => setMenu(!menu)} aria-expanded={menu}>
            <Icon name="menu" /> Todas as categorias
          </button>
          {Object.keys(categories)
            .slice(1)
            .map((category) => (
              <button key={category} onClick={() => choose(category)}>
                {category}
              </button>
            ))}
          <Link className="offer" to="/ofertas">
            Ofertas
          </Link>
          <span className="nav-note">
            <Icon name="shield" /> Uma experiência feita para você
          </span>
        </div>
      </nav>
      {menu && (
        <div className="wrap menu-panel">
          {Object.keys(categories).map((category) => (
            <button key={category} onClick={() => choose(category)}>
              {category}
            </button>
          ))}
          <Link to="/ajuda" onClick={() => setMenu(false)}>
            Atendimento
          </Link>
        </div>
      )}
    </>
  );
}
