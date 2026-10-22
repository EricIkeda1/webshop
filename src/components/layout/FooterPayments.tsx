/** Vector badges are illustrative: checkout does not process payments. */
export default function FooterPayments() {
  return (
    <div
      className="footer-payment-logos"
      role="group"
      aria-label="Formas de pagamento ilustrativas. Nenhum pagamento real é processado."
    >
      <div className="payment-cards">
        <svg
          className="payment-badge"
          viewBox="0 0 56 32"
          role="img"
          aria-label="Visa"
        >
          <rect x=".5" y=".5" width="55" height="31" rx="4" />
          <text x="28" y="22" textAnchor="middle" className="visa-word">
            VISA
          </text>
        </svg>
        <svg
          className="payment-badge"
          viewBox="0 0 56 32"
          role="img"
          aria-label="Mastercard"
        >
          <rect x=".5" y=".5" width="55" height="31" rx="4" />
          <circle cx="22" cy="16" r="9" fill="#eb001b" />
          <circle cx="34" cy="16" r="9" fill="#f79e1b" />
          <path d="M28 9.3a9 9 0 0 1 0 13.4 9 9 0 0 1 0-13.4Z" fill="#ff5f00" />
        </svg>
        <svg
          className="payment-badge"
          viewBox="0 0 56 32"
          role="img"
          aria-label="Elo"
        >
          <rect x=".5" y=".5" width="55" height="31" rx="4" />
          <text x="28" y="22" textAnchor="middle" className="elo-word">
            elo
          </text>
        </svg>
        <svg
          className="payment-badge"
          viewBox="0 0 56 32"
          role="img"
          aria-label="American Express"
        >
          <rect x=".5" y=".5" width="55" height="31" rx="4" />
          <text x="28" y="14" textAnchor="middle" className="amex-word">
            AMERICAN
          </text>
          <text x="28" y="23" textAnchor="middle" className="amex-word">
            EXPRESS
          </text>
        </svg>
      </div>
      <div className="payment-local">
        <svg
          className="pix-badge"
          viewBox="0 0 94 32"
          role="img"
          aria-label="Pix"
        >
          <path
            fill="#32bca9"
            d="m13 3 6 6-4 4a2 2 0 0 1-3 0L8 9Zm8 8 5 5-5 5-5-5Zm-15 0 5 5-5 5-5-5Zm7 8 6 6-6 6-6-6 5-5a2 2 0 0 1 3 0Z"
          />
          <text x="34" y="24" className="pix-word">
            pix
          </text>
        </svg>
        <span className="payment-divider" aria-hidden="true" />
        <svg
          className="boleto-badge"
          viewBox="0 0 56 32"
          role="img"
          aria-label="Boleto"
        >
          <rect x=".5" y=".5" width="55" height="31" rx="4" />
          <path d="M11 6v12m3-12v12m4-12v12m2-12v12m4-12v12m3-12v12m4-12v12m2-12v12m4-12v12m4-12v12m3-12v12" />
          <text x="28" y="27" textAnchor="middle" className="boleto-word">
            Boleto
          </text>
        </svg>
      </div>
    </div>
  );
}
