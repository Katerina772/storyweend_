import { NavLink, useParams } from "react-router-dom";

const LINKS = [
  { to: "", label: "Огляд", end: true },
  { to: "characters", label: "Персонажі" },
  { to: "locations", label: "Локації" },
  { to: "relations", label: "Зв’язки" },
  { to: "factions", label: "Фракції" },
  { to: "timeline", label: "Хронологія" },
  { to: "lore", label: "Лор" },
  { to: "map", label: "Карта" },
  { to: "members", label: "Учасники" },
  { to: "settings", label: "Налаштування" },
];

export function ProjectSidebar() {
  const { projectId } = useParams();

  return (
    <aside className="w-56 bg-slate-900 border-r border-slate-800 p-4">
      <nav className="flex flex-col gap-1">
        {LINKS.map((link) => {
          const path = link.to
            ? `/projects/${projectId}/${link.to}`
            : `/projects/${projectId}`;

          return (
            <NavLink
              key={link.to || "overview"}
              to={path}
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
          );
        })}
      </nav>
    </aside>
  );
}
