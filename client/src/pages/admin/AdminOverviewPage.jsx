import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api/admin.api.js";
import { Loader } from "../../components/ui/Loader.jsx";

const STAT_CARDS = [
  { key: "users", label: "Користувачі", icon: "👥", color: "text-blue-400" },
  { key: "projects", label: "Проєкти", icon: "🌍", color: "text-green-400" },
  { key: "content", label: "Контент", icon: "📦", color: "text-purple-400" },
  {
    key: "activityLogs",
    label: "Записи журналу",
    icon: "📋",
    color: "text-yellow-400",
  },
];

export default function AdminOverviewPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    adminApi
      .overview()
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled)
          setError(err.response?.data?.error || "Не вдалося завантажити");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="px-3 py-2 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-100 mb-6">Огляд системи</h1>

      {/* Основні метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
          <div className="text-3xl mb-2 text-blue-400">👥</div>
          <div className="text-3xl font-bold text-slate-100">
            {data.users.total}
          </div>
          <div className="text-sm text-slate-400">Користувачів</div>
          <div className="text-xs text-slate-500 mt-2">
            {data.users.admins} адмін · {data.users.regular} звичайних
          </div>
        </div>

        <Link
          to="/admin/projects"
          className="bg-slate-900 border border-slate-800 rounded-lg p-5 hover:border-slate-700 transition"
        >
          <div className="text-3xl mb-2 text-green-400">🌍</div>
          <div className="text-3xl font-bold text-slate-100">
            {data.projects.total}
          </div>
          <div className="text-sm text-slate-400">Проєктів</div>
          <div className="text-xs text-slate-500 mt-2">
            {data.projects.members} учасників
          </div>
        </Link>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
          <div className="text-3xl mb-2 text-purple-400">📦</div>
          <div className="text-3xl font-bold text-slate-100">
            {Object.values(data.content).reduce((a, b) => a + b, 0)}
          </div>
          <div className="text-sm text-slate-400">Об’єктів контенту</div>
          <div className="text-xs text-slate-500 mt-2">усього по системі</div>
        </div>

        <Link
          to="/admin/logs"
          className="bg-slate-900 border border-slate-800 rounded-lg p-5 hover:border-slate-700 transition"
        >
          <div className="text-3xl mb-2 text-yellow-400">📋</div>
          <div className="text-3xl font-bold text-slate-100">
            {data.activityLogs}
          </div>
          <div className="text-sm text-slate-400">Записів журналу</div>
          <div className="text-xs text-slate-500 mt-2">
            адміністративних дій
          </div>
        </Link>
      </div>

      {/* Деталізація контенту */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">
          Контент по системі
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <div className="text-2xl font-bold text-slate-100">
              {data.content.characters}
            </div>
            <div className="text-sm text-slate-400">Персонажів</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100">
              {data.content.locations}
            </div>
            <div className="text-sm text-slate-400">Локацій</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100">
              {data.content.factions}
            </div>
            <div className="text-sm text-slate-400">Фракцій</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100">
              {data.content.events}
            </div>
            <div className="text-sm text-slate-400">Подій</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100">
              {data.content.loreEntries}
            </div>
            <div className="text-sm text-slate-400">Записів лору</div>
          </div>
        </div>
      </div>
    </div>
  );
}
