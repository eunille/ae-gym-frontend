import { ReactNode } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/signup";
import Layout from "./components/layout";
import ProtectedRoute from "./utils/protected-route";
import MembershipPage from "./pages/member-page";
import ProductPage from "./pages/product-page";
import AnalyticsPage from "./pages/analytics-page";

function App(): ReactNode {
  return (
    <>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route>
            <Route path="/" element={<Layout />}>
              <Route index path="" element={<Navigate to="membership" />} />
              <Route path="membership" element={<MembershipPage />} />
              <Route path="products" element={<ProductPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
            </Route>
          </Route>
        </Route>
        {/* <Route path="*" element={<PageNotFound />} /> */}
      </Routes>
    </>
  );
}

export default App;
