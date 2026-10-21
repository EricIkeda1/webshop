import { useRef, useState } from "react";
import type { Product } from "../../types/product";
import ProductCard from "./ProductCard";
export default function ProductCarousel({ products }: { products: Product[] }) {
  const rail = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  function selectPage(index: number) {
    const element = rail.current;
    if (!element) return;
    element.scrollTo({
      left: ((element.scrollWidth - element.clientWidth) * index) / 2,
      behavior: "smooth",
    });
    setPage(index);
  }
  return (
    <>
      <div
        className="carousel"
        ref={rail}
        onScroll={() => {
          const element = rail.current;
          if (element && element.scrollWidth > element.clientWidth)
            setPage(
              Math.round(
                (element.scrollLeft /
                  (element.scrollWidth - element.clientWidth)) *
                  2,
              ),
            );
        }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="dots">
        {[0, 1, 2].map((index) => (
          <button
            key={index}
            className={page === index ? "active" : ""}
            onClick={() => selectPage(index)}
            aria-label={`Grupo de produtos ${index + 1}`}
          />
        ))}
      </div>
    </>
  );
}
