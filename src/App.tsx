import { HashRouter, Route, Routes } from "react-router-dom";
import { StoreProvider } from "./contexts/StoreContext";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import ProductPage from "./pages/ProductPage";
import FavoritesPage from "./pages/FavoritesPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AccountPage from "./pages/AccountPage";
import OrderPage from "./pages/OrderPage";
import HelpPage from "./pages/HelpPage";
import InstitutionalPage from "./pages/InstitutionalPage";
import NotFoundPage from "./pages/NotFoundPage";
export default function App() {
  return (
    <HashRouter>
      <StoreProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="catalogo" element={<CatalogPage />} />
            <Route path="ofertas" element={<CatalogPage offers />} />
            <Route path="produto/:id" element={<ProductPage />} />
            <Route path="favoritos" element={<FavoritesPage />} />
            <Route path="carrinho" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="conta" element={<AccountPage />} />
            <Route path="pedido/:id" element={<OrderPage />} />
            <Route path="institucional" element={<InstitutionalPage />} />
            <Route path="ajuda" element={<HelpPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </StoreProvider>
    </HashRouter>
  );
}
