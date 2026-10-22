import { useState } from "react";
import type { ReactNode } from "react";
import Icon from "./Icon";
import "../../styles/demo-store-notice.css";

/** Gate the application before mounting the store, including direct product links. */
export default function DemoStoreNotice({ children }: { children: ReactNode }) {
  const [accepted, setAccepted] = useState(false);
  if (accepted) return children;
  return (
    <main className="demo-entry">
      <div className="demo-entry-card" aria-labelledby="demo-entry-title">
        <div className="demo-entry-brand">
          <img src="/assets/logo.png" alt="EYI" />
          <span>
            EYI <b>STORE</b>
          </span>
        </div>
        <div className="demo-entry-label">
          <span aria-hidden="true" /> PROJETO DEMONSTRATIVO
        </div>
        <h1 id="demo-entry-title">Esta loja é fictícia.</h1>
        <p className="demo-entry-description">
          Antes de entrar, saiba que este site foi criado para demonstrar uma
          experiência de e-commerce. Você pode explorar à vontade, mas nenhuma
          compra é real.
        </p>
        <ul className="demo-entry-points">
          <li>
            <Icon name="card" />
            <div>
              <strong>Nenhuma cobrança será realizada</strong>
              <span>Pix, cartão e checkout são apenas simulações.</span>
            </div>
          </li>
          <li>
            <Icon name="truck" />
            <div>
              <strong>Nenhum produto será enviado</strong>
              <span>
                Consultar o frete não gera um envio. Os pedidos são
                demonstrativos.
              </span>
            </div>
          </li>
          <li>
            <Icon name="shield" />
            <div>
              <strong>Use somente dados fictícios</strong>
              <span>Não informe dados pessoais reais durante os testes.</span>
            </div>
          </li>
        </ul>
        <button
          className="btn demo-entry-button"
          autoFocus
          onClick={() => {
            setAccepted(true);
            window.scrollTo(0, 0);
          }}
        >
          Entendi, entrar na loja
        </button>
        <p className="demo-entry-caption">
          Uma demonstração para explorar, experimentar e conhecer.
        </p>
      </div>
      <p className="demo-entry-copyright">
        © {new Date().getFullYear()} EYI Store · Loja demonstrativa
      </p>
    </main>
  );
}
