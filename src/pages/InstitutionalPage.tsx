import { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Icon from "../components/ui/Icon";
import "../styles/institutional.css";
const sections = [
  { id: "sobre-nos", label: "Sobre nós" },
  { id: "nossas-lojas", label: "Nossas lojas" },
  { id: "trabalhe-conosco", label: "Trabalhe conosco" },
];
export default function InstitutionalPage() {
  const [params] = useSearchParams();
  const selected = params.get("secao") ?? "sobre-nos";
  const page = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const active = page.current?.querySelector<HTMLElement>(
      `[id="${sections.find((item) => item.id === selected)?.id ?? "sobre-nos"}"]`,
    );
    active?.classList.remove("institutional-highlight");
    const animate = requestAnimationFrame(() =>
      active?.classList.add("institutional-highlight"),
    );
    if (!params.has("secao")) return () => cancelAnimationFrame(animate);
    const frame = requestAnimationFrame(() => {
      const section = page.current?.querySelector<HTMLElement>(
        `[id="${sections.find((item) => item.id === selected)?.id ?? "sobre-nos"}"]`,
      );
      section?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      });
    });
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(animate);
    };
  }, [params, selected]);
  return (
    <div className="institutional-page" ref={page}>
      <div className="breadcrumb">
        <Link to="/">Início</Link> / Institucional
      </div>
      <header className="institutional-hero">
        <div>
          <span className="eyebrow">CONHEÇA A EYI</span>
          <h1>
            Mais perto das suas
            <br />
            próximas escolhas.
          </h1>
          <p>
            Conheça a nossa proposta, encontre informações sobre a loja e
            acompanhe as oportunidades.
          </p>
        </div>
        <div className="institutional-monogram" aria-hidden="true">
          <img src="/assets/logo.png" alt="" />
        </div>
      </header>
      <nav className="institutional-nav" aria-label="Seções institucionais">
        {sections.map((section) => (
          <Link
            key={section.id}
            aria-current={selected === section.id ? "location" : undefined}
            className={selected === section.id ? "active" : ""}
            to={`/institucional?secao=${section.id}`}
          >
            {section.label}
          </Link>
        ))}
      </nav>
      <section className="institutional-section" id="sobre-nos">
        <div className="institutional-section-label">
          <span>01 / NOSSA PROPOSTA</span>
          <h2>Sobre nós</h2>
        </div>
        <div className="institutional-section-content">
          <h3>Escolhas que fazem sentido para o seu dia a dia.</h3>
          <p>
            A EYI Store reúne tecnologia, beleza, casa e moda em uma experiência
            de compra simples de explorar. Nossa proposta é aproximar você de
            produtos que combinam com a sua rotina, com uma interface clara do
            primeiro contato até a escolha final.
          </p>
          <p>
            Aqui, você pode descobrir novas possibilidades, comparar opções e
            guardar seus favoritos para depois.
          </p>
          <div className="institutional-values">
            {[
              [
                "search",
                "Fácil de descobrir",
                "Categorias organizadas para encontrar o que você procura.",
              ],
              [
                "heart",
                "Do seu jeito",
                "Salve favoritos e monte uma seleção com a sua cara.",
              ],
              [
                "bag",
                "Simples de navegar",
                "Uma experiência adaptada ao computador e ao celular.",
              ],
            ].map(([icon, title, text]) => (
              <div key={title}>
                <Icon name={icon} />
                <h4>{title}</h4>
                <p>{text}</p>
              </div>
            ))}
          </div>
          <Link className="link" to="/catalogo">
            Conhecer os produtos
          </Link>
        </div>
      </section>
      <section className="institutional-section" id="nossas-lojas">
        <div className="institutional-section-label">
          <span>02 / ONDE ESTAMOS</span>
          <h2>Nossas lojas</h2>
        </div>
        <div className="institutional-section-content">
          <h3>A sua próxima visita pode começar aqui.</h3>
          <p>
            Esta versão da EYI Store funciona como uma experiência virtual
            demonstrativa. Ainda não há lojas físicas ou pontos de retirada
            cadastrados.
          </p>
          <div className="institutional-callout">
            <Icon name="home" />
            <div>
              <h4>Loja online EYI</h4>
              <p>Explore as coleções no seu ritmo, de onde estiver.</p>
            </div>
            <Link className="btn outline" to="/catalogo">
              Visitar a loja
            </Link>
          </div>
        </div>
      </section>
      <section className="institutional-section" id="trabalhe-conosco">
        <div className="institutional-section-label">
          <span>03 / OPORTUNIDADES</span>
          <h2>Trabalhe conosco</h2>
        </div>
        <div className="institutional-section-content">
          <h3>Boas ideias começam com pessoas.</h3>
          <p>
            Este espaço reúne as informações sobre oportunidades na EYI Store.
            No momento, não há vagas abertas ou processo seletivo nesta
            demonstração.
          </p>
          <div className="institutional-callout">
            <Icon name="user" />
            <div>
              <h4>Nenhuma vaga disponível no momento</h4>
              <p>
                Novas oportunidades poderão ser apresentadas aqui quando forem
                cadastradas.
              </p>
            </div>
          </div>
        </div>
      </section>
      <p className="notice">
        A EYI Store é um projeto demonstrativo. Não realiza vendas, entregas ou
        contratações reais.
      </p>
    </div>
  );
}
