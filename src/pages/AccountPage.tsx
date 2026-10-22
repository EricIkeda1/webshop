import { useState } from "react";
import MobileSheet from "../components/ui/MobileSheet";
import { Link } from "react-router-dom";
import { useStore } from "../contexts/StoreContext";
import { money } from "../utils/format";
import EmptyState from "../components/ui/EmptyState";
import Icon from "../components/ui/Icon";
export default function AccountPage() {
  const { orders, favorites, count } = useStore();
  const [detail, setDetail] = useState("");
  return (
    <section className="page account-page">
      <div className="breadcrumb">
        <Link to="/">Início</Link> / Minha conta
      </div>
      <div className="section-head">
        <div>
          <h2>Bem-vindo de volta.</h2>
          <p>Seus favoritos e pedidos, em um só lugar.</p>
        </div>
      </div>
      <div className="mobile-account">
        <div className="account-greeting">
          <span className="account-avatar">EY</span>
          <div>
            <h2>Olá, bem-vindo</h2>
            <p>Suas escolhas e seus pedidos estão aqui.</p>
          </div>
        </div>
        <div className="mobile-menu-list account-menu">
          <button
            onClick={() =>
              document
                .getElementById("account-orders")
                ?.scrollIntoView({
                  behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                  ).matches
                    ? "instant"
                    : "smooth",
                })
            }
          >
            <Icon name="box" />
            <span>Meus pedidos</span>
            <Icon name="chevron" />
          </button>
          {[
            ["Meus dados", "user"],
            ["Endereços", "pin"],
            ["Formas de pagamento", "card"],
          ].map(([name, icon]) => (
            <button key={name} onClick={() => setDetail(name)}>
              <Icon name={icon} />
              <span>{name}</span>
              <Icon name="chevron" />
            </button>
          ))}
          <button onClick={() => window.location.reload()}>
            <Icon name="logout" />
            <span>Sair da demonstração</span>
            <Icon name="chevron" />
          </button>
        </div>
      </div>
      {detail && (
        <MobileSheet open title={detail} onClose={() => setDetail("")}>
          <p className="sheet-description">
            {detail === "Meus dados"
              ? "Esta conta é demonstrativa e não possui cadastro. Os favoritos e pedidos ficam salvos apenas neste navegador."
              : detail === "Endereços"
                ? "Você pode informar o endereço e buscar seu CEP ao finalizar a compra. Esta demonstração não possui uma agenda de endereços."
                : "No checkout você pode conhecer as opções de pagamento da demonstração. Nenhum valor é cobrado e nenhum cartão é salvo."}
          </p>
          <Link
            className="btn full-width"
            to={detail === "Meus dados" ? "/favoritos" : "/carrinho"}
            onClick={() => setDetail("")}
          >
            {detail === "Meus dados"
              ? "Ver meus favoritos"
              : "Ir para o carrinho"}
          </Link>
        </MobileSheet>
      )}
      <div className="cart-layout">
        <div className="panel" id="account-orders">
          <h3>Meus pedidos</h3>
          {orders.length ? (
            orders.map((order) => (
              <Link
                key={order.id}
                to={`/pedido/${order.id}`}
                className="cart-row"
              >
                <div className="success-icon order-icon">
                  <Icon name="check" />
                </div>
                <div className="cart-row-info">
                  <h3>Pedido #{order.id}</h3>
                  <span className="small-note">
                    {new Date(order.date).toLocaleDateString("pt-BR")} ·
                    Demonstração confirmada
                  </span>
                </div>
                <b>{money(order.total)}</b>
              </Link>
            ))
          ) : (
            <EmptyState
              title="Sua história começa aqui"
              description="Os pedidos demonstrativos realizados neste navegador aparecerão aqui."
              icon="user"
            />
          )}
        </div>
        <div className="panel">
          <h3>Seu espaço EYI</h3>
          <p className="small-note">
            Acompanhe suas escolhas salvas neste dispositivo.
          </p>
          <Link className="btn outline account-link" to="/favoritos">
            <Icon name="heart" /> Meus favoritos ({favorites.length})
          </Link>
          <Link className="btn outline full-width" to="/carrinho">
            <Icon name="bag" /> Meu carrinho ({count})
          </Link>
          <div className="notice">
            Esta versão utiliza uma conta local demonstrativa, sem login ou
            cadastro. Os pedidos ficam salvos apenas neste navegador.
          </div>
        </div>
      </div>
    </section>
  );
}
