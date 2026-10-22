import { Link } from "react-router-dom";
import { useStore } from "../../contexts/StoreContext";
import { money } from "../../utils/format";
import Icon from "../ui/Icon";
export default function OrderSummary({
  checkout = false,
}: {
  checkout?: boolean;
}) {
  const { count, subtotal, discount, shippingSelection } = useStore();
  const shipping = shippingSelection?.option.price ?? 0;
  const total = subtotal - discount + shipping;
  return (
    <>
      <h3 className="summary-heading">Resumo do pedido</h3>
      <div className="summary-line">
        <span>
          Subtotal ({count} {count === 1 ? "item" : "itens"})
        </span>
        <b>{money(subtotal)}</b>
      </div>
      {discount > 0 && (
        <div className="summary-line">
          <span>Desconto EYI10</span>
          <b>− {money(discount)}</b>
        </div>
      )}
      <div className="summary-line">
        <span>Entrega</span>
        <b>{shippingSelection ? money(shipping) : "A calcular"}</b>
      </div>
      <div className="summary-line total">
        <span>{shippingSelection ? "Total" : "Subtotal com desconto"}</span>
        <b>{money(total)}</b>
      </div>
      <p className="small-note">Em até 6x de {money(total / 6)} sem juros</p>
      {checkout ? (
        <button
          className="btn"
          type="submit"
          form="checkout-form"
          disabled={!shippingSelection}
        >
          Confirmar pedido demonstrativo
        </button>
      ) : (
        <Link className="btn" to="/checkout">
          Finalizar compra
        </Link>
      )}
      <div className="small-note summary-note">
        <Icon name="shield" /> Nenhum valor será cobrado
      </div>
    </>
  );
}
