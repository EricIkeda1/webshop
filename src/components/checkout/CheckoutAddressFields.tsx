import { useStore } from "../../contexts/StoreContext";
import { useCepAddress } from "../../hooks/useCepAddress";
import { BRAZILIAN_STATES } from "../../types/address";
import "../../styles/checkout-address.css";
export default function CheckoutAddressFields() {
  const { shippingCep, setShippingCep } = useStore();
  const { cep, address, status, message, updateCep, updateField, search } =
    useCepAddress(shippingCep);
  return (
    <>
      <div className="field full cep-field">
        <label htmlFor="checkout-cep">CEP</label>
        <div className="cep-search">
          <input
            id="checkout-cep"
            className="input"
            name="cep"
            value={cep}
            onChange={(event) => {
              updateCep(event.target.value);
              setShippingCep(event.target.value);
            }}
            inputMode="numeric"
            maxLength={9}
            pattern="[0-9]{5}-?[0-9]{3}"
            placeholder="00000-000"
            required
            aria-describedby="cep-status cep-privacy"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void search();
              }
            }}
          />
          <button
            type="button"
            className="btn outline"
            disabled={
              status === "loading" || cep.replace(/\D/g, "").length !== 8
            }
            onClick={() => {
              void search();
            }}
          >
            {status === "loading" ? "Buscando…" : "Buscar CEP"}
          </button>
        </div>
        <span
          id="cep-status"
          className={`cep-status ${status}`}
          role="status"
          aria-live="polite"
        >
          {message}
        </span>
        <span id="cep-privacy" className="cep-privacy">
          Somente o CEP é enviado aos serviços de consulta. Para testar, use
          01001-000.
        </span>
      </div>
      <label className="field full">
        Logradouro
        <input
          className="input"
          name="street"
          value={address.street}
          onChange={(event) => updateField("street", event.target.value)}
          placeholder="Rua, avenida ou praça"
          required
        />
      </label>
      <label className="field">
        Bairro
        <input
          className="input"
          name="neighborhood"
          value={address.neighborhood}
          onChange={(event) => updateField("neighborhood", event.target.value)}
          placeholder="Seu bairro"
          required
        />
      </label>
      <label className="field">
        Cidade
        <input
          className="input"
          name="city"
          value={address.city}
          onChange={(event) => updateField("city", event.target.value)}
          placeholder="Sua cidade"
          required
        />
      </label>
      <label className="field">
        Estado (UF)
        <select
          className="input"
          name="state"
          value={address.state}
          onChange={(event) => updateField("state", event.target.value)}
          required
        >
          <option value="">Selecione</option>
          {BRAZILIAN_STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        Número
        <input
          className="input"
          name="number"
          placeholder="123 ou S/N"
          required
        />
      </label>
      <label className="field full">
        Complemento
        <input
          className="input"
          name="extra"
          placeholder="Apartamento, bloco etc. (opcional)"
        />
      </label>
    </>
  );
}
