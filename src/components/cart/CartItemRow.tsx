import { Link } from "react-router-dom";
import type { CartItem } from "../../types/store";
import { useStore } from "../../contexts/StoreContext";
import { money } from "../../utils/format";
import { categoryLabel } from "../../utils/categories";
import QuantitySelector from "../ui/QuantitySelector";
import Icon from "../ui/Icon";
export default function CartItemRow({
  item,
  readOnly = false,
}: {
  item: CartItem;
  readOnly?: boolean;
}) {
  const { updateQuantity, removeFromCart } = useStore();
  const { product, quantity } = item;
  return (
    <div className="cart-row">
      <Link to={`/produto/${product.id}`}>
        <img src={product.thumbnail} alt={product.title} />
      </Link>
      <div className="cart-row-info">
        <h3>{product.title}</h3>
        <div className="small-note">
          {product.brand ?? categoryLabel(product.category)}
        </div>
        <div className="price">{money(product.price)}</div>
        {readOnly ? (
          <span className="small-note">Quantidade: {quantity}</span>
        ) : (
          <QuantitySelector
            value={quantity}
            max={product.stock}
            onChange={(value) => updateQuantity(product.id, value)}
          />
        )}
      </div>
      {!readOnly && (
        <button
          className="trash"
          onClick={() => removeFromCart(product.id)}
          aria-label={`Remover ${product.title}`}
        >
          <Icon name="trash" />
        </button>
      )}
    </div>
  );
}
