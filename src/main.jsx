import { createRoot } from "react-dom/client";
import { StrictMode, useEffect, useState } from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SiteProvider } from "./context/SiteContext";
import ProtectedRoute from "./ProtectedRoute";
import App from "./App";
import "./index.css";

import Shop from "./pages/Shop/Shop";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <SiteProvider>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/shop/:gender" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </SiteProvider>
    </HashRouter>
  </StrictMode>
);