import { Link } from "react-router-dom";
import Brand from "./Brand";
import Icon from "../ui/Icon";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-intro">
            <Brand />
            <p>
              Escolhas que inspiram. Qualidade que acompanha.
              <br />
              Encontre seus próximos favoritos na EYI.
            </p>
          </div>
          <div>
            <h4>Explore a loja</h4>
            {["Tecnologia", "Beleza", "Casa e decoração", "Moda"].map(
              (category) => (
                <Link
                  key={category}
                  to={`/catalogo?categoria=${encodeURIComponent(category)}`}
                >
                  {category}
                </Link>
              ),
            )}
            <Link to="/ofertas">Ofertas especiais</Link>
          </div>
          <div>
            <h4>Conte com a gente</h4>
            <Link to="/ajuda">Central de ajuda</Link>
            <Link to="/ajuda">Entregas e devoluções</Link>
            <Link to="/conta">Meus pedidos</Link>
            <Link to="/favoritos">Meus favoritos</Link>
          </div>
          <div>
            <h4>Compre com tranquilidade</h4>
            <p>
              <Icon name="shield" /> Ambiente de demonstração
              <br />
              <Icon name="card" /> Checkout sem cobrança real
              <br />
              <Icon name="heart" /> Feito com atenção aos detalhes
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} EYI Store. Todos os direitos
            reservados.
          </span>
          <span>
            Projeto demonstrativo • Produtos DummyJSON • Valores ilustrativos em
            reais
          </span>
        </div>
      </div>
    </footer>
  );
}
