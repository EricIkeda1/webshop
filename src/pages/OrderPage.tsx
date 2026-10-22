import { Link, useParams } from "react-router-dom";
import { useStore } from "../contexts/StoreContext";
import { money } from "../utils/format";
import CartItemRow from "../components/cart/CartItemRow";
import EmptyState from "../components/ui/EmptyState";
import Icon from "../components/ui/Icon";
export default function OrderPage() {
  const { id } = useParams();
  const { orders } = useStore();
  const order = orders.find((item) => item.id === id);
  if (!order)
    return (
      <EmptyState
        title="Pedido não encontrado"
        description="Consulte seus pedidos na página Minha conta."
      />
    );
  return (
    <section className="success panel">
      <div className="success-icon">
        <Icon name="check" />
      </div>
      <h1>Pedido realizado!</h1>
      <p className="small-note">
        Sua compra demonstrativa foi concluída com sucesso.
      </p>
      <p className="small-note">
        Código do pedido: <b className="link">#{order.id}</b>
        <br />
        Nenhum pagamento foi realizado ou e-mail enviado.
      </p>
      {order.items.map((item) => (
        <CartItemRow key={item.product.id} item={item} readOnly />
      ))}
      <div className="summary-line">
        <span>Subtotal</span>
        <b>{money(order.subtotal)}</b>
      </div>
      {order.discount > 0 && (
        <div className="summary-line">
          <span>Desconto</span>
          <b>− {money(order.discount)}</b>
        </div>
      )}
      <div className="summary-line">
        <span>
          {order.shippingQuoted === false
            ? "Entrega não cotada"
            : "Entrega cotada"}
        </span>
        <b>
          {order.shippingQuoted === false
            ? "Não incluída no total"
            : money(order.shipping)}
        </b>
      </div>
      <div className="summary-line total">
        <span>
          {order.shippingQuoted === false
            ? "Total demonstrativo sem frete"
            : "Total demonstrativo"}
        </span>
        <b>{money(order.total)}</b>
      </div>
      <div className="notice">
        Pagamento: {order.payment} (simulado)
        <br />
        Status: pedido demonstrativo confirmado.
        {order.shippingQuoted === false && (
          <>
            <br />O frete não foi cotado e não está incluído no total. Nenhum
            produto será enviado.
          </>
        )}
        {order.shippingSandbox && (
          <>
            <br />
            Entrega baseada em cotação de teste (sandbox).
          </>
        )}
      </div>
      <div className="inline center">
        <Link className="btn" to="/conta">
          Acompanhar pedidos
        </Link>
        <Link className="btn outline" to="/">
          Voltar à loja
        </Link>
      </div>
    </section>
  );
}
