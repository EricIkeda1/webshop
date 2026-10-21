import { useEffect } from "react";
import { useStore } from "../../contexts/StoreContext";
export default function Toast() {
  const { toast, clearToast } = useStore();
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(clearToast, 3000);
    return () => clearTimeout(timer);
  }, [toast, clearToast]);
  return (
    <div
      id="toast"
      role="status"
      aria-live="polite"
      className={toast ? "visible" : ""}
    >
      {toast}
    </div>
  );
}
