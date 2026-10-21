import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useStore } from "../../contexts/StoreContext";
import Header from "./Header";
import Footer from "./Footer";
import MobileNav from "./MobileNav";
import Toast from "../ui/Toast";
export default function Layout() {
  const { pathname, search } = useLocation();
  const { loading, error, offline, retry } = useStore();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "EYI Store • Seus próximos favoritos";
  }, [pathname, search]);
  return (
    <>
      <Header />
      <main className="wrap">
        {loading ? (
          <div className="loading" role="status">
            Carregando seus próximos favoritos…
          </div>
        ) : error ? (
          <div className="empty">
            <h2>Não foi possível carregar a loja.</h2>
            <p>{error}</p>
            <button className="btn" onClick={retry}>
              Tentar novamente
            </button>
          </div>
        ) : (
          <>
            {offline && (
              <div className="notice">
                Mostrando a última cópia do catálogo. A atualização da API está
                indisponível no momento.
              </div>
            )}
            <Outlet />
          </>
        )}
      </main>
      <Footer />
      <MobileNav />
      <Toast />
    </>
  );
}
