import { Link } from "react-router-dom";
import { useStore } from "../contexts/StoreContext";
import { money } from "../utils/format";
import EmptyState from "../components/ui/EmptyState";
import Icon from "../components/ui/Icon";
export default function AccountPage() {
  const { orders, favorites, count } = useStore();
  return (
    <section className="page">
      <div className="breadcrumb">
        <Link to="/">Início</Link> / Minha conta
      </div>
      <div className="section-head">
        <div>
          <h2>Bem-vindo de volta.</h2>
          <p>Seus favoritos e pedidos, em um só lugar.</p>
        </div>
      </div>
      <div className="cart-layout">
        <div className="panel">
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
