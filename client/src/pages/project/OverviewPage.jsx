import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProjectContext } from "../../hooks/useProjectContext.js";
import { projectsApi } from "../../api/projects.api.js";
import { Loader } from "../../components/ui/Loader.jsx";

const STATS = [
  {
    key: "characters",
    label: "Персонажі",
    icon: "👥",
    to: "characters",
    color: "text-blue-400",
  },
  {
    key: "locations",
    label: "Локації",
    icon: "🗺️",
    to: "locations",
    color: "text-green-400",
  },
  {
    key: "factions",
    label: "Фракції",
    icon: "🛡️",
    to: "factions",
    color: "text-purple-400",
  },
  {
    key: "events",
    label: "Події",
    icon: "📜",
    to: "timeline",
    color: "text-yellow-400",
  },
  {
    key: "loreEntries",
    label: "Записи лору",
    icon: "📖",
    to: "lore",
    color: "text-pink-400",
  },
  {
    key: "relations",
    label: "Зв’язки",
    icon: "🕸️",
    to: "relations",
    color: "text-cyan-400",
  },
  {
    key: "mapMarkers",
    label: "Маркери на карті",
    icon: "📍",
    to: "map",
    color: "text-red-400",
  },
  {
    key: "members",
    label: "Учасники",
    icon: "🤝",
    to: "members",
    color: "text-orange-400",
  },
];

export default function OverviewPage() {
  const project = useProjectContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    projectsApi
      .overview(project.id)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err.response?.data?.error || "Не вдалося завантажити статистику",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [project.id]);

  return (
    <div>
      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">
          {project.name}
        </h1>
        {project.description ? (
          <p className="text-slate-400">{project.description}</p>
        ) : (
          <p className="text-slate-500 italic">Без опису</p>
        )}
      </div>

      {loading && <Loader />}

      {!loading && error && (
        <div className="px-3 py-2 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      {!loading && data && (
        <>
          {/* Статистика */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {STATS.map((stat) => (
              <Link
                key={stat.key}
                to={`/projects/${project.id}/${stat.to}`}
                className="block"
              >
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 hover:border-slate-700 transition">
                  <div className={`text-3xl mb-2 ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-slate-100">
                    {data.counts[stat.key] ?? 0}
                  </div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Підказки */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">
              З чого почати?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex gap-3">
                <span className="text-xl">1️⃣</span>
                <div>
                  <p className="text-slate-200 font-medium">Створіть локації</p>
                  <p className="text-slate-400">
                    Почніть з країн та міст — це основа світу.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-xl">2️⃣</span>
                <div>
                  <p className="text-slate-200 font-medium">
                    Додайте персонажів
                  </p>
                  <p className="text-slate-400">
                    Опишіть героїв, їхні ролі та моральні категорії.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-xl">3️⃣</span>
                <div>
                  <p className="text-slate-200 font-medium">Зв’яжіть їх</p>
                  <p className="text-slate-400">
                    Побудуйте граф взаємовідносин між персонажами.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-xl">4️⃣</span>
                <div>
                  <p className="text-slate-200 font-medium">
                    Побудуйте хронологію
                  </p>
                  <p className="text-slate-400">
                    Опишіть ключові події історії світу.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
