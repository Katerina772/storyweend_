import { Routes, Route, Navigate } from "react-router-dom";
import { PublicLayout } from "../components/layout/PublicLayout.jsx";
import { AppLayout } from "../components/layout/AppLayout.jsx";
import { PrivateRoute } from "./PrivateRoute.jsx";

import LoginPage from "../pages/public/LoginPage.jsx";
import RegisterPage from "../pages/public/RegisterPage.jsx";
import DashboardPage from "../pages/dashboard/DashboardPage.jsx";
import SharedProjectsPage from "../pages/dashboard/SharedProjectsPage.jsx";
import ProfilePage from "../pages/dashboard/ProfilePage.jsx";
import SettingsPage from "../pages/dashboard/SettingsPage.jsx";

export function AppRouter() {
  return (
    <Routes>
      {/* Публічні */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Приватні */}
      <Route element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/shared" element={<SharedProjectsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Редіректи */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
