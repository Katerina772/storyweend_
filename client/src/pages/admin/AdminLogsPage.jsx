import { useEffect, useState, useCallback } from "react";
import { adminApi } from "../../api/admin.api.js";
import { Badge } from "../../components/ui/Badge.jsx";
import { Loader } from "../../components/ui/Loader.jsx";

const ACTION_LABELS = {
  USER_REGISTERED: { label: "Реєстрація", color: "green" },
  USER_LOGIN: { label: "Вхід", color: "blue" },
  USER_BLOCKED: { label: "Блокування", color: "red" },
  USER_UNBLOCKED: { label: "Розблокування", color: "green" },
  USER_ROLE_CHANGED: { label: "Зміна ролі", color: "yellow" },
  PROJECT_CREATED: { label: "Створення проєкту", color: "purple" },
  PROJECT_DELETED: { label: "Видалення проєкту", color: "red" },
  PROJECT_MEMBER_ADDED: { label: "Додано учасника", color: "blue" },
  PROJECT_MEMBER_REMOVED: { label: "Видалено учасника", color: "red" },
  ADMIN_SETTINGS_CHANGED: { label: "Зміна налаштувань", color: "yellow" },
};

export default function AdminLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionFilter, setActionFilter] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const filters = { limit: 200 };
      if (actionFilter) filters.action = actionFilter;
      const { logs } = await adminApi.listLogs(filters);
      setLogs(logs);
    } catch (err) {
      setError(err.response?.data?.error || "Не вдалося завантажити");
    } finally {
      setLoading(false);
    }
  }, [actionFilter]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Журнал дій</h1>
        <p className="text-sm text-slate-400 mt-1">
          Останні {logs.length} подій системи
        </p>
      </div>

      <div className="mb-6">
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-100 rounded-md px-3 py-2 focus:outline-none focus:border-yellow-500"
        >
          <option value="">Усі дії</option>
          {Object.entries(ACTION_LABELS).map(([key, info]) => (
            <option key={key} value={key}>
              {info.label}
            </option>
          ))}
        </select>
      </div>

      {loading && <Loader />}

      {!loading && error && (
        <div className="px-3 py-2 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-800">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase">
                  Час
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase">
                  Користувач
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase">
                  Дія
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase">
                  Об’єкт
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase">
                  Деталі
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500">
                    Журнал порожній
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const info = ACTION_LABELS[log.action] || {
                    label: log.action,
                    color: "gray",
                  };
                  return (
                    <tr
                      key={log.id}
                      className="border-b border-slate-800 last:border-0"
                    >
                      <td className="px-4 py-3 text-sm text-slate-400 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString("uk-UA")}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-300">
                        {log.user?.username || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge color={info.color}>{info.label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400">
                        {log.entityType ? (
                          <>
                            {log.entityType}
                            {log.entityId && ` #${log.entityId}`}
                          </>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 font-mono max-w-xs truncate">
                        {log.metadata ? JSON.stringify(log.metadata) : "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
