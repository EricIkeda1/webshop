export default function QuantitySelector({
  value,
  max,
  onChange,
}: {
  value: number;
  max: number;
  onChange: (quantity: number) => void;
}) {
  return (
    <div className="quantity">
      <button
        type="button"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
        aria-label="Diminuir quantidade"
      >
        −
      </button>
      <span aria-live="polite">{value}</span>
      <button
        type="button"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        aria-label="Aumentar quantidade"
      >
        +
      </button>
    </div>
  );
}
