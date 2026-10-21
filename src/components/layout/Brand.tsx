import { Link } from "react-router-dom";
export default function Brand() {
  return (
    <Link to="/" className="brand" aria-label="EYI Store, início">
      <img src="/assets/logo.png" alt="Logo EYI" />
      <span className="brand-word">
        ERIC <em>Y.</em> IKEDA
      </span>
    </Link>
  );
}
