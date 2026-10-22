import { NavLink } from "react-router-dom";
import Icon from "../ui/Icon";
const items = [
  ["/", "home", "Início"],
  ["/catalogo", "search", "Buscar"],
  ["/favoritos", "heart", "Favoritos"],
  ["/conta", "user", "Conta"],
];
export default function MobileNav() {
  return (
    <nav className="mobile-nav" aria-label="Navegação principal">
      {items.map(([path, icon, title]) => (
        <NavLink
          key={path}
          to={path}
          end={path === "/"}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <span className="mobile-nav-icon">
            <Icon name={icon} />
          </span>
          {title}
        </NavLink>
      ))}
    </nav>
  );
}
