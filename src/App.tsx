import { ReactNode } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";

import Layout from "./components/layout";
import ProtectedRoute from "./utils/protected-route";

import ProductPage from "./pages/product-page";
import AnalyticsPage from "./pages/analytics-page";
import MembershipPage from "./pages/membershipPage";
import MemberPage from "./pages/member-page";


function App(): ReactNode {
  return (
    <>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route>
            <Route path="/" element={<Layout />}>
              <Route index path="" element={<Navigate to="members" />} />
              <Route path="members" element={<MemberPage />} />
              <Route path="products" element={<ProductPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="membership" element={<MembershipPage />} />
            </Route>
          </Route>
        </Route>
        {/* <Route path="*" element={<PageNotFound />} /> */}
      </Routes>
    </>
  );
}

export default App;
