import { Link } from "react-router-dom";
import Icon from "./Icon";
export default function EmptyState({
  title,
  description,
  icon = "bag",
}: {
  title: string;
  description: string;
  icon?: string;
}) {
  return (
    <div className="empty">
      <Icon name={icon} />
      <h2>{title}</h2>
      <p>{description}</p>
      <Link className="btn" to="/catalogo">
        Explorar produtos
      </Link>
    </div>
  );
}
