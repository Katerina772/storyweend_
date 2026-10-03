import { Outlet } from "react-router-dom";
import { Header } from "./Header.jsx";
import { DashboardSidebar } from "./DashboardSidebar.jsx";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
