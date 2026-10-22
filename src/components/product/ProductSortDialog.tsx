import { useEffect, useId, useRef } from "react";
import Icon from "../ui/Icon";
const options = [
  {
    value: "featured",
    label: "Mais relevantes",
    detail: "Destaques da seleção para você",
    icon: "tag",
  },
  {
    value: "low",
    label: "Menor preço",
    detail: "Do menor para o maior valor",
    icon: "sort",
  },
  {
    value: "high",
    label: "Maior preço",
    detail: "Do maior para o menor valor",
    icon: "sort",
  },
  {
    value: "rating",
    label: "Melhor avaliação",
    detail: "Os favoritos de quem avaliou",
    icon: "heart",
  },
];
export function ProductSortButton({
  value,
  open,
  onClick,
  className,
}: {
  value: string;
  open: boolean;
  onClick: () => void;
  className: string;
}) {
  const label =
    options.find((option) => option.value === value)?.label ?? options[0].label;
  return (
    <button
      type="button"
      className={`product-sort-trigger ${className}`}
      onClick={onClick}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-label={`Ordenar produtos: ${label}`}
    >
      <Icon name="sort" />
      <span>
        <span className="sort-trigger-prefix">Ordenar: </span>
        {label}
      </span>
      <span className="sort-trigger-chevron">
        <Icon name="chevron" />
      </span>
    </button>
  );
}
export default function ProductSortDialog({
  open,
  value,
  onChange,
  onClose,
}: {
  open: boolean;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  useEffect(() => {
    const element = dialog.current;
    if (!element || !open) return;
    element.showModal();
    document.body.classList.add("product-sort-open");
    return () => {
      element.close();
      document.body.classList.remove("product-sort-open");
    };
  }, [open]);
  return (
    <dialog
      ref={dialog}
      className="product-sort-dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="product-sort-surface">
        <span className="sort-sheet-handle" aria-hidden="true" />
        <div className="sort-dialog-heading">
          <span className="sort-dialog-symbol">
            <Icon name="sort" />
          </span>
          <button
            type="button"
            className="sort-dialog-close"
            aria-label="Fechar ordenação"
            onClick={onClose}
          >
            <Icon name="close" />
          </button>
        </div>
        <h2 id={titleId}>Ordenar produtos</h2>
        <p id={descriptionId}>Como você prefere ordenar os produtos?</p>
        <div className="product-sort-options" aria-label="Opções de ordenação">
          {options.map((option) => (
            <button
              type="button"
              key={option.value}
              className={`product-sort-option ${value === option.value ? "is-selected" : ""}`}
              aria-pressed={value === option.value}
              onClick={() => onChange(option.value)}
            >
              <span className="sort-option-icon">
                <Icon name={option.icon} />
              </span>
              <span className="sort-option-copy">
                <strong>{option.label}</strong>
                <small>{option.detail}</small>
              </span>
              <span className="sort-option-check" aria-hidden="true">
                {value === option.value && <Icon name="check" />}
              </span>
            </button>
          ))}
        </div>
        <p className="sort-dialog-note">
          A escolha vale para todo o catálogo filtrado.
        </p>
      </div>
    </dialog>
  );
}
