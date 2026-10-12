import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useProjectContext } from "../../hooks/useProjectContext.js";
import { usePermissions } from "../../hooks/usePermissions.js";
import { loreApi } from "../../api/lore.api.js";
import { LoreCard } from "../../components/project/LoreCard.jsx";
import { CreateLoreModal } from "../../components/project/CreateLoreModal.jsx";
import { LoreDetailModal } from "../../components/project/LoreDetailModal.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Loader } from "../../components/ui/Loader.jsx";
import { EmptyState } from "../../components/ui/EmptyState.jsx";

export default function LorePage() {
  const { projectId } = useParams();
  const project = useProjectContext();
  const { canCreate } = usePermissions();

  const [entries, setEntries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const filters = {};
      if (search.trim()) filters.search = search.trim();
      if (categoryFilter) filters.category = categoryFilter;

      const [{ lore }, { categories }] = await Promise.all([
        loreApi.list(projectId, filters),
        loreApi.categories(projectId),
      ]);
      setEntries(lore);
      setCategories(categories);
    } catch (err) {
      setError(err.response?.data?.error || "Не вдалося завантажити лор");
    } finally {
      setLoading(false);
    }
  }, [projectId, search, categoryFilter]);

  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [load]);

  const handleCreated = (lore) => {
    setEntries((prev) => [lore, ...prev]);
    if (lore.category && !categories.includes(lore.category)) {
      setCategories((prev) => [...prev, lore.category].sort());
    }
  };

  const handleUpdated = (updated) => {
    setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    setSelectedEntry(updated);
    if (updated.category && !categories.includes(updated.category)) {
      setCategories((prev) => [...prev, updated.category].sort());
    }
  };

  const handleDeleted = (deletedId) => {
    setEntries((prev) => prev.filter((e) => e.id !== deletedId));
    setSelectedEntry(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Лор</h1>
          <p className="text-sm text-slate-400 mt-1">
            {entries.length} записів у проєкті «{project.name}»
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => setCreateOpen(true)}>+ Створити запис</Button>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Input
          placeholder="Пошук за назвою або вмістом..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-100 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
        >
          <option value="">Усі категорії</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
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

      {!loading && !error && entries.length === 0 && (
        <EmptyState
          icon="📖"
          title={
            search || categoryFilter ? "Нічого не знайдено" : "Ще немає записів"
          }
          description={
            search || categoryFilter
              ? "Спробуйте змінити фільтри."
              : canCreate
                ? "Опишіть історію світу, магію, релігію, культуру чи традиції."
                : "Коли власник додасть записи лору, вони з'являться тут."
          }
          action={
            !search &&
            !categoryFilter &&
            canCreate && (
              <Button onClick={() => setCreateOpen(true)}>
                Створити запис
              </Button>
            )
          }
        />
      )}

      {!loading && !error && entries.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map((e) => (
            <LoreCard
              key={e.id}
              entry={e}
              onClick={() => setSelectedEntry(e)}
            />
          ))}
        </div>
      )}

      <CreateLoreModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={handleCreated}
        existingCategories={categories}
      />

      <LoreDetailModal
        open={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
        entry={selectedEntry}
        onUpdated={handleUpdated}
        onDeleted={handleDeleted}
        existingCategories={categories}
      />
    </div>
  );
}
