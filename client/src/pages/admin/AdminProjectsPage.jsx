import { useEffect, useState, useCallback } from "react";
import { adminApi } from "../../api/admin.api.js";
import { Input } from "../../components/ui/Input.jsx";
import { Loader } from "../../components/ui/Loader.jsx";
import { Modal } from "../../components/ui/Modal.jsx";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const filters = {};
      if (search.trim()) filters.search = search.trim();
      const { projects } = await adminApi.listProjects(filters);
      setProjects(projects);
    } catch (err) {
      setError(err.response?.data?.error || "Не вдалося завантажити");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [load]);

  const handleOpenDetails = async (projectId) => {
    try {
      const { project } = await adminApi.getProject(projectId);
      setSelectedProject(project);
    } catch (err) {
      alert(err.response?.data?.error || "Не вдалося завантажити проєкт");
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Проєкти</h1>
        <p className="text-sm text-slate-400 mt-1">
          {projects.length} творчих проєктів
        </p>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Пошук за назвою..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
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
                  Проєкт
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase">
                  Власник
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase">
                  Учасники
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase">
                  Створено
                </th>
                <th className="text-right px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500">
                    Нічого не знайдено
                  </td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-slate-800 last:border-0"
                  >
                    <td className="px-4 py-3">
                      <span className="text-slate-200 text-sm">{p.name}</span>
                      <span className="text-xs text-slate-500 ml-2">
                        #{p.id}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">
                      {p.owner.username}
                      <div className="text-xs text-slate-500">
                        {p.owner.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">
                      {p._count.members}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {new Date(p.createdAt).toLocaleDateString("uk-UA")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleOpenDetails(p.id)}
                        className="text-yellow-400 hover:text-yellow-300 text-sm"
                      >
                        Деталі →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Модалка деталей */}
      <Modal
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        title={selectedProject?.name || ""}
      >
        {selectedProject && (
          <div className="flex flex-col gap-4">
            <div className="text-xs px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-400">
              ℹ️ Адміністратор бачить лише метадані. Вміст проєкту приватний.
            </div>

            <div>
              <div className="text-xs text-slate-500 uppercase mb-1">
                Власник
              </div>
              <div className="text-sm text-slate-200">
                {selectedProject.owner.username} ({selectedProject.owner.email})
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 uppercase mb-1">Дати</div>
              <div className="text-sm text-slate-200">
                Створено:{" "}
                {new Date(selectedProject.createdAt).toLocaleString("uk-UA")}
                <br />
                Оновлено:{" "}
                {new Date(selectedProject.updatedAt).toLocaleString("uk-UA")}
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 uppercase mb-2">
                Елементи
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between bg-slate-800 rounded px-3 py-2">
                  <span className="text-slate-400">Учасники</span>
                  <span className="text-slate-200">
                    {selectedProject._count.members}
                  </span>
                </div>
                <div className="flex justify-between bg-slate-800 rounded px-3 py-2">
                  <span className="text-slate-400">Персонажі</span>
                  <span className="text-slate-200">
                    {selectedProject._count.characters}
                  </span>
                </div>
                <div className="flex justify-between bg-slate-800 rounded px-3 py-2">
                  <span className="text-slate-400">Локації</span>
                  <span className="text-slate-200">
                    {selectedProject._count.locations}
                  </span>
                </div>
                <div className="flex justify-between bg-slate-800 rounded px-3 py-2">
                  <span className="text-slate-400">Фракції</span>
                  <span className="text-slate-200">
                    {selectedProject._count.factions}
                  </span>
                </div>
                <div className="flex justify-between bg-slate-800 rounded px-3 py-2">
                  <span className="text-slate-400">Події</span>
                  <span className="text-slate-200">
                    {selectedProject._count.events}
                  </span>
                </div>
                <div className="flex justify-between bg-slate-800 rounded px-3 py-2">
                  <span className="text-slate-400">Лор</span>
                  <span className="text-slate-200">
                    {selectedProject._count.loreEntries}
                  </span>
                </div>
                <div className="flex justify-between bg-slate-800 rounded px-3 py-2">
                  <span className="text-slate-400">Зв’язки</span>
                  <span className="text-slate-200">
                    {selectedProject._count.relations}
                  </span>
                </div>
                <div className="flex justify-between bg-slate-800 rounded px-3 py-2">
                  <span className="text-slate-400">Маркери карти</span>
                  <span className="text-slate-200">
                    {selectedProject._count.mapMarkers}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
