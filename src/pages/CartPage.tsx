import { Link } from "react-router-dom";
import { useStore } from "../contexts/StoreContext";
import CartItemRow from "../components/cart/CartItemRow";
import OrderSummary from "../components/cart/OrderSummary";
import ShippingCalculator from "../components/cart/ShippingCalculator";
import EmptyState from "../components/ui/EmptyState";
export default function CartPage() {
  const { cart, count, coupon, applyCoupon } = useStore();
  return (
    <section className="page">
      <div className="breadcrumb">
        <Link to="/">Início</Link> / Carrinho
      </div>
      <div className="section-head">
        <div>
          <h2>
            Meu carrinho{" "}
            <span className="link">
              ({count} {count === 1 ? "item" : "itens"})
            </span>
          </h2>
          <p>Seus próximos favoritos estão quase com você.</p>
        </div>
      </div>
      {!cart.length ? (
        <EmptyState
          title="Seu carrinho está esperando por você"
          description="Explore nossa seleção e encontre algo que é a sua cara."
        />
      ) : (
        <div className="cart-layout">
          <div className="panel">
            {cart.map((item) => (
              <CartItemRow key={item.product.id} item={item} />
            ))}
            <Link className="link continue-shopping" to="/catalogo">
              Continuar comprando
            </Link>
          </div>
          <div className="panel summary">
            <h3>Calcular frete</h3>
            <ShippingCalculator />
            <h3 className="summary-heading">Cupom de desconto</h3>
            <form
              className="inline"
              onSubmit={(event) => {
                event.preventDefault();
                applyCoupon(
                  String(new FormData(event.currentTarget).get("coupon") ?? ""),
                );
              }}
            >
              <input
                className="input"
                name="coupon"
                defaultValue={coupon}
                placeholder="Use EYI10"
                aria-label="Cupom"
                required
              />
              <button className="btn outline">Aplicar</button>
            </form>
            <OrderSummary />
          </div>
        </div>
      )}
    </section>
  );
}
