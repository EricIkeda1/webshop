import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import FooterPayments from "./FooterPayments";
import FooterSocials from "./FooterSocials";
import "../../styles/footer.css";

const information = {
  terms: {
    title: "Termos de uso",
    text: "Esta loja é uma demonstração para explorar produtos, salvar favoritos e simular pedidos. Os preços são ilustrativos em reais, sem conversão cambial. Nenhum pagamento é processado e nenhum pedido é enviado para entrega. Use dados fictícios no checkout.",
  },
  privacy: {
    title: "Política de privacidade",
    text: "Carrinho, favoritos e histórico de pedidos ficam no armazenamento local deste navegador. Nome, endereço e e-mail digitados no checkout não são enviados a um servidor de pedidos nem armazenados no histórico. O catálogo e as imagens são consultados na DummyJSON e as fontes no Google Fonts, serviços que recebem as requisições do navegador. Somente o CEP digitado é enviado ao ViaCEP e, se necessário, à BrasilAPI para consultar o endereço. A newsletter é demonstrativa e não cadastra seu e-mail. Você pode apagar os dados locais nas configurações do navegador.",
  },
  social: {
    title: "Nossas redes sociais",
    text: "Os links dos perfis oficiais ainda não foram configurados. Os ícones já estão preparados no componente FooterSocials para receber os endereços da sua loja.",
  },
};
type InformationKey = keyof typeof information;

export default function Footer() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<InformationKey>("terms");
  function showInformation(key: InformationKey) {
    setActive(key);
    dialog.current?.showModal();
  }
  return (
    <footer className="site-footer">
      <svg className="footer-logo-filter" aria-hidden="true">
        <defs>
          <filter id="footer-logo-tone" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0.07 0 0 0 0  -0.22 0 0.3 0 0  -0.90 0 1 0 0  0 0 1 0 0"
            />
          </filter>
        </defs>
      </svg>
      <div className="wrap">
        <div className="site-footer-grid">
          <div className="site-footer-intro">
            <Link
              to="/"
              className="site-footer-brand"
              aria-label="EYI Store, início"
            >
              <img src="/assets/logo.png" alt="Logo EYI" />
              <span>
                ERIC <em>Y.</em> IKEDA
              </span>
            </Link>
            <p>
              Tecnologia, beleza, casa e muito mais,
              <br />
              com curadoria para o seu dia a dia.
            </p>
            <FooterSocials onSelect={() => showInformation("social")} />
          </div>
          <nav className="site-footer-column" aria-label="Institucional">
            <h2>
              <Link to="/institucional">Institucional</Link>
            </h2>
            <Link to="/institucional?secao=sobre-nos">Sobre nós</Link>
            <Link to="/institucional?secao=nossas-lojas">Nossas lojas</Link>
            <Link to="/institucional?secao=trabalhe-conosco">
              Trabalhe conosco
            </Link>
          </nav>
          <nav className="site-footer-column" aria-label="Atendimento">
            <h2>Atendimento</h2>
            <Link to="/ajuda">Central de ajuda</Link>
            <Link to="/ajuda">Trocas e devoluções</Link>
            <button onClick={() => showInformation("terms")}>
              Termos de uso
            </button>
            <button onClick={() => showInformation("privacy")}>
              Política de privacidade
            </button>
          </nav>
          <div className="site-footer-column site-footer-payment">
            <h2>Pagamento</h2>
            <FooterPayments />
          </div>
        </div>
        <div className="site-footer-bottom">
          © {new Date().getFullYear()} Todos os direitos reservados.
        </div>
      </div>
      <dialog
        ref={dialog}
        className="footer-dialog"
        aria-labelledby="footer-dialog-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <h2 id="footer-dialog-title">{information[active].title}</h2>
        <p>{information[active].text}</p>
        <form method="dialog">
          <button className="btn">Fechar</button>
        </form>
      </dialog>
    </footer>
  );
}
