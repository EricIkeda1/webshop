import { useNavigate } from "react-router-dom";
import MobileSheet from "../ui/MobileSheet";
import Icon from "../ui/Icon";
const rows = [
  ["Tecnologia", "laptop"],
  ["Beleza", "perfume"],
  ["Casa e decoração", "home"],
  ["Moda", "shirt"],
  ["Ofertas", "tag"],
];
export default function MobileCategoryMenu({
  open,
  onClose,
  choose,
  active,
}: {
  open: boolean;
  onClose: () => void;
  choose: (category: string) => void;
  active: string;
}) {
  const navigate = useNavigate();
  function go(path: string) {
    onClose();
    navigate(path);
  }
  return (
    <MobileSheet
      open={open}
      onClose={onClose}
      title="Explore a loja"
      placement="top"
    >
      <img className="sheet-brand" src="/assets/logo.png" alt="EYI" />
      <p className="sheet-subtitle">
        Encontre tudo o que você precisa no mesmo lugar.
      </p>
      <div className="mobile-menu-list">
        {rows.map(([name, icon]) => (
          <button
            key={name}
            className={active === name ? "selected" : ""}
            onClick={() => (name === "Ofertas" ? go("/ofertas") : choose(name))}
          >
            <span className="menu-icon">
              <Icon name={icon} />
            </span>
            <span>{name}</span>
            <Icon name="chevron" />
          </button>
        ))}
      </div>
      <div className="mobile-menu-list mobile-menu-secondary">
        <button onClick={() => go("/catalogo")}>
          <span className="menu-icon">
            <Icon name="search" />
          </span>
          <span>Ver todos os produtos</span>
          <Icon name="chevron" />
        </button>
        <button onClick={() => go("/conta")}>
          <span className="menu-icon">
            <Icon name="box" />
          </span>
          <span>Meus pedidos</span>
          <Icon name="chevron" />
        </button>
        <button onClick={() => go("/ajuda")}>
          <span className="menu-icon">
            <Icon name="headset" />
          </span>
          <span>Atendimento</span>
          <Icon name="chevron" />
        </button>
      </div>
    </MobileSheet>
  );
}
