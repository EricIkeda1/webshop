import { NavLink } from "react-router-dom";
import { useStore } from "../../contexts/StoreContext";
import Icon from "../ui/Icon";
const items = [
  ["/", "home", "Início"],
  ["/catalogo", "search", "Buscar"],
  ["/favoritos", "heart", "Favoritos"],
  ["/carrinho", "bag", "Carrinho"],
  ["/conta", "user", "Conta"],
];
export default function MobileNav() {
  const { count } = useStore();
  return (
    <nav className="mobile-nav" aria-label="Navegação principal">
      {items.map(([path, icon, title]) => (
        <NavLink
          key={path}
          to={path}
          end={path === "/"}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <Icon name={icon} />
          {path === "/carrinho" && count > 0 && (
            <span className="count">{count}</span>
          )}
          {title}
        </NavLink>
      ))}
    </nav>
  );
}
