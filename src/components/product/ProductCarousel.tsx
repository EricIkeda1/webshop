import { useEffect, useId, useRef, useState } from "react";
import type { Product } from "../../types/product";
import { carouselPages } from "../../utils/carousel";
import ProductCard from "./ProductCard";
export default function ProductCarousel({ products }: { products: Product[] }) {
  const rail = useRef<HTMLDivElement>(null);
  const id = useId();
  const [page, setPage] = useState(0);
  const [offsets, setOffsets] = useState([0]);
  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    function measure() {
      if (!element) return;
      const positions = Array.from(
        element.children,
        (card) => (card as HTMLElement).offsetLeft,
      );
      const next = carouselPages(
        positions,
        element.clientWidth,
        element.scrollWidth,
      );
      setOffsets(next);
      setPage(
        next.reduce(
          (best, offset, index) =>
            Math.abs(offset - element.scrollLeft) <
            Math.abs(next[best] - element.scrollLeft)
              ? index
              : best,
          0,
        ),
      );
    }
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(element);
    return () => resize.disconnect();
  }, [products.length]);
  function selectPage(index: number) {
    rail.current?.scrollTo({
      left: offsets[index],
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  return (
    <>
      <div
        className="carousel"
        ref={rail}
        id={id}
        role="region"
        aria-label="Produtos em destaque"
        aria-roledescription="carrossel"
        onScroll={() => {
          const element = rail.current;
          if (element)
            setPage(
              offsets.reduce(
                (best, offset, index) =>
                  Math.abs(offset - element.scrollLeft) <
                  Math.abs(offsets[best] - element.scrollLeft)
                    ? index
                    : best,
                0,
              ),
            );
        }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {offsets.length > 1 && (
        <div
          className="dots product-carousel-dots"
          aria-label="Grupos de produtos"
        >
          {offsets.map((_, index) => (
            <button
              key={index}
              type="button"
              className={page === index ? "active" : ""}
              onClick={() => selectPage(index)}
              aria-label={`Grupo de produtos ${index + 1}`}
              aria-pressed={page === index}
              aria-controls={id}
            />
          ))}
        </div>
      )}
    </>
  );
}
