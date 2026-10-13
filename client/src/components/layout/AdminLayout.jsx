import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { Button } from "../ui/Button.jsx";

const LINKS = [
  { to: "/admin", label: "Огляд", end: true },
  { to: "/admin/users", label: "Користувачі" },
  { to: "/admin/projects", label: "Проєкти" },
  { to: "/admin/logs", label: "Журнал дій" },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-100">StoryWeend</span>
          </Link>
          <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 border border-yellow-500/30 text-yellow-300">
            Адмінпанель
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="text-sm text-slate-400 hover:text-slate-100"
          >
            ← До кабінету
          </Link>
          <span className="text-sm text-slate-300">{user?.username}</span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Вийти
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-56 bg-slate-900 border-r border-slate-800 p-4">
          <nav className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm transition ${
                    isActive
                      ? "bg-yellow-600 text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
