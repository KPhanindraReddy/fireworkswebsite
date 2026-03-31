import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout.jsx";
import { PageSpinner } from "./components/LoadingState.jsx";

const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const ProductsPage = lazy(() => import("./pages/ProductsPage.jsx"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage.jsx"));
const CartPage = lazy(() => import("./pages/CartPage.jsx"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage.jsx"));
const OrdersPage = lazy(() => import("./pages/OrdersPage.jsx"));
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage.jsx"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));

const renderPage = (PageComponent) => (
  <Suspense fallback={<PageSpinner label="Loading page" />}>
    <PageComponent />
  </Suspense>
);

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={renderPage(HomePage)} />
        <Route path="/products" element={renderPage(ProductsPage)} />
        <Route path="/products/:id" element={renderPage(ProductDetailPage)} />
        <Route path="/cart" element={renderPage(CartPage)} />
        <Route path="/checkout" element={renderPage(CheckoutPage)} />
        <Route path="/orders" element={renderPage(OrdersPage)} />
        <Route path="/orders/success/:orderId" element={renderPage(OrderSuccessPage)} />
        <Route path="/admin" element={renderPage(AdminDashboardPage)} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={renderPage(NotFoundPage)} />
      </Route>
    </Routes>
  );
}

export default App;
