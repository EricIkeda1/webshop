import { useEffect, useRef, useState } from "react";
import { useStore } from "../../contexts/StoreContext";
import { formatCep } from "../../services/addressApi";
import { cartShippingKey, getShippingQuote } from "../../services/shippingApi";
import type { ShippingQuote } from "../../types/shipping";
import { money } from "../../utils/format";
export default function ShippingCalculator({
  checkout = false,
}: {
  checkout?: boolean;
}) {
  const {
    cart,
    shippingCep,
    setShippingCep,
    shippingSelection,
    selectShipping,
  } = useStore();
  const [quote, setQuote] = useState<ShippingQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const request = useRef<AbortController | null>(null);
  const key = cartShippingKey(cart);
  const cep = shippingCep.replace(/\D/g, "");
  useEffect(() => {
    request.current?.abort();
    setQuote(null);
    setError("");
    setLoading(false);
    return () => request.current?.abort();
  }, [key, cep]);
  async function calculate() {
    if (!/^\d{8}$/.test(cep)) {
      setError("Informe um CEP com 8 dígitos.");
      return;
    }
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    setError("");
    selectShipping(null);
    try {
      const result = await getShippingQuote(cep, cart, controller.signal);
      if (!controller.signal.aborted) setQuote(result);
    } catch (failure) {
      if (!controller.signal.aborted)
        setError(
          failure instanceof Error
            ? failure.message
            : "Não foi possível calcular o frete.",
        );
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }
  return (
    <div className="shipping-calculator">
      <div className="inline">
        {!checkout && (
          <input
            className="input"
            value={formatCep(shippingCep)}
            onChange={(event) => setShippingCep(formatCep(event.target.value))}
            placeholder="Digite seu CEP"
            inputMode="numeric"
            maxLength={9}
            aria-label="CEP para calcular frete"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void calculate();
              }
            }}
          />
        )}
        <button
          type="button"
          className="btn"
          disabled={loading || cep.length !== 8}
          onClick={() => {
            void calculate();
          }}
        >
          {loading
            ? "Calculando…"
            : checkout
              ? "Consultar opções de entrega"
              : "Calcular"}
        </button>
      </div>
      {!quote && !shippingSelection && !error && (
        <p className="small-note">
          {checkout
            ? "Informe o CEP acima e consulte os valores de entrega."
            : "Informe o CEP para consultar transportadoras e prazos."}
        </p>
      )}
      {error && (
        <p className="notice" role="status">
          {error}
        </p>
      )}
      {quote?.sandbox && (
        <p className="notice">
          Cotação de teste: ambiente sandbox. Os valores ainda não são de
          produção.
        </p>
      )}
      {quote?.options.map((option) => (
        <label className="radio-card" key={option.id}>
          <input
            type="radio"
            name="shipping-service"
            checked={shippingSelection?.option.id === option.id}
            onChange={() =>
              selectShipping({
                cep,
                cartKey: key,
                option,
                sandbox: quote.sandbox,
              })
            }
          />
          <div>
            {option.label}
            <p className="small-note">Até {option.days} dias úteis</p>
          </div>
          <span>{money(option.price)}</span>
        </label>
      ))}
      {shippingSelection && !quote && (
        <p className="notice">
          {shippingSelection.option.label} ·{" "}
          {money(shippingSelection.option.price)} · Até{" "}
          {shippingSelection.option.days} dias úteis
          {shippingSelection.sandbox ? " · Cotação de teste" : ""}
        </p>
      )}
    </div>
  );
}
