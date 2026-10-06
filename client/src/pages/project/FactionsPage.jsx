import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useProjectContext } from "../../hooks/useProjectContext.js";
import { usePermissions } from "../../hooks/usePermissions.js";
import { factionsApi } from "../../api/factions.api.js";
import { FactionCard } from "../../components/project/FactionCard.jsx";
import { CreateFactionModal } from "../../components/project/CreateFactionModal.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Loader } from "../../components/ui/Loader.jsx";
import { EmptyState } from "../../components/ui/EmptyState.jsx";

export default function FactionsPage() {
  const { projectId } = useParams();
  const project = useProjectContext();
  const { canCreate } = usePermissions();

  const [factions, setFactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const filters = {};
      if (search.trim()) filters.search = search.trim();
      const { factions } = await factionsApi.list(projectId, filters);
      setFactions(factions);
    } catch (err) {
      setError(err.response?.data?.error || "Не вдалося завантажити фракції");
    } finally {
      setLoading(false);
    }
  }, [projectId, search]);

  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [load]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Фракції</h1>
          <p className="text-sm text-slate-400 mt-1">
            {factions.length} у проєкті «{project.name}»
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => setModalOpen(true)}>+ Створити фракцію</Button>
        )}
      </div>

      <div className="mb-6">
        <Input
          placeholder="Пошук за назвою або описом..."
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

      {!loading && !error && factions.length === 0 && (
        <EmptyState
          icon="🛡️"
          title={search ? "Нічого не знайдено" : "Ще немає фракцій"}
          description={
            search
              ? "Спробуйте змінити фільтри."
              : canCreate
                ? "Створіть державу, гільдію, клан або іншу організацію свого світу."
                : "Коли власник додасть фракції, вони з'являться тут."
          }
          action={
            !search &&
            canCreate && (
              <Button onClick={() => setModalOpen(true)}>
                Створити фракцію
              </Button>
            )
          }
        />
      )}

      {!loading && !error && factions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {factions.map((f) => (
            <FactionCard key={f.id} faction={f} />
          ))}
        </div>
      )}

      <CreateFactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={(faction) => setFactions((prev) => [faction, ...prev])}
      />
    </div>
  );
}
