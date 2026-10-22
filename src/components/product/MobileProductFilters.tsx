import { useState } from "react";
import { categories } from "../../utils/categories";
import { money } from "../../utils/format";
import MobileSheet from "../ui/MobileSheet";
export interface ProductFilters {
  category: string;
  maxPrice: number;
  rating: number;
}
export default function MobileProductFilters({
  initial,
  onApply,
  onClose,
}: {
  initial: ProductFilters;
  onApply: (filters: ProductFilters) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(initial);
  return (
    <MobileSheet open onClose={onClose} title="Filtrar produtos">
      <fieldset className="sheet-filter-group">
        <legend>Categoria</legend>
        <div className="filter-chips">
          {Object.keys(categories).map((name) => (
            <button
              key={name}
              aria-pressed={draft.category === name}
              onClick={() => setDraft({ ...draft, category: name })}
            >
              {name}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="sheet-filter-group">
        <legend>Faixa de preço</legend>
        <div className="range-labels">
          <span>{money(10)}</span>
          <output htmlFor="mobile-max-price">
            Até {money(draft.maxPrice)}
          </output>
        </div>
        <input
          id="mobile-max-price"
          aria-label="Preço máximo"
          type="range"
          min="10"
          max="40000"
          step="10"
          value={draft.maxPrice}
          onChange={(event) =>
            setDraft({ ...draft, maxPrice: Number(event.target.value) })
          }
        />
      </fieldset>
      <fieldset className="sheet-filter-group">
        <legend>Avaliação mínima</legend>
        <div className="filter-chips ratings">
          {[0, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              aria-pressed={draft.rating === rating}
              onClick={() => setDraft({ ...draft, rating })}
            >
              <span aria-hidden="true">★</span>{" "}
              {rating ? `${rating}+` : "Todas"}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="sheet-filter-actions">
        <button
          className="btn outline"
          onClick={() =>
            setDraft({ category: "Todos", maxPrice: 40000, rating: 0 })
          }
        >
          Limpar
        </button>
        <button className="btn" onClick={() => onApply(draft)}>
          Aplicar filtros
        </button>
      </div>
    </MobileSheet>
  );
}
