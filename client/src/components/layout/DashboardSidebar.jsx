import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/dashboard", label: "Мої проєкти", end: true },
  { to: "/dashboard/shared", label: "Спільні проєкти" },
  { to: "/profile", label: "Профіль" },
  { to: "/settings", label: "Налаштування" },
];

export function DashboardSidebar() {
  return (
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
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
