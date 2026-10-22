import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../contexts/StoreContext";
import OrderSummary from "../components/cart/OrderSummary";
import CheckoutAddressFields from "../components/checkout/CheckoutAddressFields";
import ShippingCalculator from "../components/cart/ShippingCalculator";
import EmptyState from "../components/ui/EmptyState";
export default function CheckoutPage() {
  const { cart, placeOrder, shippingSelection } = useStore();
  const navigate = useNavigate();
  const shipping = shippingSelection?.option.price ?? 0;
  if (!cart.length)
    return (
      <EmptyState
        title="Adicione produtos para continuar"
        description="Escolha seus favoritos antes de finalizar."
      />
    );
  return (
    <section className="page">
      <div className="breadcrumb">
        <Link to="/carrinho">Carrinho</Link> / Finalizar compra
      </div>
      <div className="section-head">
        <h2>Falta pouco para ser seu.</h2>
      </div>
      <div className="steps">
        <b>1. Identificação</b>
        <span>2. Entrega</span>
        <span>3. Confirmação</span>
      </div>
      <div className="notice">
        Esta é uma compra demonstrativa. Use dados fictícios. Não solicitamos
        dados de cartão e nenhum pagamento será processado.
      </div>
      <div className="cart-layout">
        <form
          className="panel"
          id="checkout-form"
          onSubmit={(event) => {
            event.preventDefault();
            const payment = String(
              new FormData(event.currentTarget).get("payment") ?? "Pix",
            );
            const order = placeOrder(shipping, payment);
            if (order) navigate(`/pedido/${order.id}`);
          }}
        >
          <h3>Endereço de entrega</h3>
          <div className="form-grid">
            <label className="field full">
              Nome completo
              <input
                className="input"
                name="name"
                placeholder="Seu nome (fictício)"
                minLength={3}
                required
              />
            </label>
            <label className="field full">
              E-mail
              <input
                className="input"
                name="email"
                type="email"
                placeholder="voce@exemplo.com"
                required
              />
            </label>
            <CheckoutAddressFields />
          </div>
          <h3>Opções de entrega</h3>
          <ShippingCalculator checkout />
          <h3>Forma de pagamento (simulada)</h3>
          <label className="radio-card">
            <input type="radio" name="payment" value="Pix" defaultChecked />
            Pix · Aprovação demonstrativa
          </label>
          <label className="radio-card">
            <input type="radio" name="payment" value="Cartão" />
            Cartão · 6x sem juros (simulação)
          </label>
          <label className="field">
            <span>
              <input type="checkbox" required /> Entendo que este pedido é
              apenas uma demonstração.
            </span>
          </label>
        </form>
        <div className="panel summary summary-self">
          <OrderSummary checkout />
        </div>
      </div>
    </section>
  );
}
