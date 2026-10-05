import { Routes, Route, Navigate } from "react-router-dom";
import { PublicLayout } from "../components/layout/PublicLayout.jsx";
import { AppLayout } from "../components/layout/AppLayout.jsx";
import { ProjectLayout } from "../components/layout/ProjectLayout.jsx";
import { PrivateRoute } from "./PrivateRoute.jsx";

import LoginPage from "../pages/public/LoginPage.jsx";
import RegisterPage from "../pages/public/RegisterPage.jsx";
import DashboardPage from "../pages/dashboard/DashboardPage.jsx";
import SharedProjectsPage from "../pages/dashboard/SharedProjectsPage.jsx";
import ProfilePage from "../pages/dashboard/ProfilePage.jsx";
import SettingsPage from "../pages/dashboard/SettingsPage.jsx";

import OverviewPage from "../pages/project/OverviewPage.jsx";
import CharactersPage from "../pages/project/CharactersPage.jsx";
import LocationsPage from "../pages/project/LocationsPage.jsx";
import RelationsPage from "../pages/project/RelationsPage.jsx";
import FactionsPage from "../pages/project/FactionsPage.jsx";
import TimelinePage from "../pages/project/TimelinePage.jsx";
import LorePage from "../pages/project/LorePage.jsx";
import MapPage from "../pages/project/MapPage.jsx";
import MembersPage from "../pages/project/MembersPage.jsx";
import ProjectSettingsPage from "../pages/project/ProjectSettingsPage.jsx";
import HomePage from "../pages/public/HomePage.jsx";
import CharacterDetailPage from "../pages/project/CharacterDetailPage.jsx";
import LocationDetailPage from "../pages/project/LocationDetailPage.jsx";

export function AppRouter() {
  return (
    <Routes>
      {/* Головна */}
      <Route path="/" element={<HomePage />} />

      {/* Публічні */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Приватні */}
      <Route element={<PrivateRoute />}>
        {/* Кабінет */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/shared" element={<SharedProjectsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Проєкт */}
        <Route path="/projects/:projectId" element={<ProjectLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="characters" element={<CharactersPage />} />
          <Route
            path="characters/:characterId"
            element={<CharacterDetailPage />}
          />
          <Route path="locations" element={<LocationsPage />} />
          <Route
            path="locations/:locationId"
            element={<LocationDetailPage />}
          />
          <Route path="relations" element={<RelationsPage />} />
          <Route path="factions" element={<FactionsPage />} />
          <Route path="timeline" element={<TimelinePage />} />
          <Route path="lore" element={<LorePage />} />
          <Route path="map" element={<MapPage />} />
          <Route path="members" element={<MembersPage />} />
          <Route path="settings" element={<ProjectSettingsPage />} />
        </Route>
      </Route>

      {/* Редіректи */}
      {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
