import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../contexts/StoreContext";
const slides = [
  {
    id: 101,
    eyebrow: "ESCOLHAS QUE INSPIRAM",
    lines: ["Design que você vê.", "Qualidade que você sente."],
    description: "Descubra os favoritos que combinam com você.",
    category: "Tecnologia",
    tag: "Apple AirPods Max",
  },
  {
    id: 10,
    eyebrow: "SEU MOMENTO, SUA ESSÊNCIA",
    lines: ["Pequenos detalhes.", "Grandes sensações."],
    description: "Uma seleção especial para cuidar de você.",
    category: "Beleza",
    tag: "Beleza em cada detalhe",
  },
  {
    id: 78,
    eyebrow: "IDEIAS QUE GANHAM VIDA",
    lines: ["Mais possibilidades.", "Todos os dias."],
    description: "Tecnologia para acompanhar seu próximo passo.",
    category: "Tecnologia",
    tag: "Seu próximo upgrade",
  },
];
export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const { products } = useStore();
  const slide = slides[index];
  const product = products.find((item) => item.id === slide.id);
  return (
    <>
      <div className="hero">
        <div className="hero-copy">
          <div className="eyebrow">{slide.eyebrow}</div>
          <h1>
            {slide.lines[0]}
            <br />
            {slide.lines[1]}
          </h1>
          <p>{slide.description}</p>
          <Link className="btn" to={`/catalogo?categoria=${slide.category}`}>
            Explorar coleção
          </Link>
        </div>
        {product && (
          <img
            className="hero-img"
            src={product.images[0] || product.thumbnail}
            alt={product.title}
            fetchPriority="high"
          />
        )}
        <div className="hero-tag">
          <small>SELEÇÃO EYI</small>
          {slide.tag}
        </div>
      </div>
      <div className="dots" aria-label="Destaques">
        {slides.map((_, slideIndex) => (
          <button
            key={slideIndex}
            className={index === slideIndex ? "active" : ""}
            onClick={() => setIndex(slideIndex)}
            aria-label={`Destaque ${slideIndex + 1}`}
            aria-pressed={index === slideIndex}
          />
        ))}
      </div>
    </>
  );
}
