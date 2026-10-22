import { useEffect, useId, useRef, type ReactNode } from "react";
import Icon from "./Icon";

/** Native dialog supplies focus containment, Escape and focus restoration. */
export default function MobileSheet({
  open,
  onClose,
  title,
  placement = "bottom",
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  placement?: "top" | "bottom";
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const closeCallback = useRef(onClose);
  closeCallback.current = onClose;
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const mobile = window.matchMedia("(max-width: 650px)");
    if (open && mobile.matches) {
      element.showModal();
      document.body.classList.add("mobile-sheet-open");
    } else if (element.open) element.close();
    const resize = () => {
      if (!mobile.matches && element.open) closeCallback.current();
    };
    mobile.addEventListener("change", resize);
    return () => {
      mobile.removeEventListener("change", resize);
      if (element.open) element.close();
      document.body.classList.remove("mobile-sheet-open");
    };
  }, [open]);
  return (
    <dialog
      ref={dialog}
      className={`mobile-sheet mobile-sheet--${placement}`}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="mobile-sheet-content">
        <span className="sheet-handle" aria-hidden="true" />
        <div className="sheet-heading">
          <h2 id={titleId}>{title}</h2>
          <button
            className="sheet-close"
            aria-label="Fechar painel"
            onClick={onClose}
          >
            <Icon name="close" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
