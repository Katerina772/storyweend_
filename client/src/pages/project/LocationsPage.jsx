import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useProjectContext } from "../../hooks/useProjectContext.js";
import { usePermissions } from "../../hooks/usePermissions.js";
import { locationsApi } from "../../api/locations.api.js";
import { LocationCard } from "../../components/project/LocationCard.jsx";
import { CreateLocationModal } from "../../components/project/CreateLocationModal.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Loader } from "../../components/ui/Loader.jsx";
import { EmptyState } from "../../components/ui/EmptyState.jsx";

const TYPES = [
  { value: "", label: "Усі типи" },
  { value: "Країна", label: "Країни" },
  { value: "Регіон", label: "Регіони" },
  { value: "Місто", label: "Міста" },
  { value: "Село", label: "Села" },
  { value: "Замок", label: "Замки" },
  { value: "Ліс", label: "Ліси" },
  { value: "Гора", label: "Гори" },
  { value: "Острів", label: "Острови" },
  { value: "Руїни", label: "Руїни" },
];

export default function LocationsPage() {
  const { projectId } = useParams();
  const project = useProjectContext();
  const { canCreate } = usePermissions();

  const [locations, setLocations] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  const loadLocations = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const filters = {};
      if (search.trim()) filters.search = search.trim();
      if (type) filters.type = type;

      const { locations: filtered } = await locationsApi.list(
        projectId,
        filters,
      );
      setLocations(filtered);

      // Завантажуємо повний список для випадаючого "батьківська локація"
      if (!search.trim() && !type) {
        setAllLocations(filtered);
      } else {
        const { locations: all } = await locationsApi.list(projectId, {});
        setAllLocations(all);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Не вдалося завантажити локації");
    } finally {
      setLoading(false);
    }
  }, [projectId, search, type]);

  useEffect(() => {
    const timer = setTimeout(loadLocations, 300);
    return () => clearTimeout(timer);
  }, [loadLocations]);

  const handleCreated = (location) => {
    setLocations((prev) => [location, ...prev]);
    setAllLocations((prev) => [location, ...prev]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Локації</h1>
          <p className="text-sm text-slate-400 mt-1">
            {locations.length} у проєкті «{project.name}»
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => setModalOpen(true)}>+ Створити локацію</Button>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Input
          placeholder="Пошук за назвою або описом..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-100 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
        >
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
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

      {!loading && !error && locations.length === 0 && (
        <EmptyState
          icon="🗺️"
          title={search || type ? "Нічого не знайдено" : "Ще немає локацій"}
          description={
            search || type
              ? "Спробуйте змінити фільтри."
              : canCreate
                ? "Почніть з країни, а потім додайте міста, села та інші місця."
                : "Коли власник додасть локації, вони з'являться тут."
          }
          action={
            !search &&
            !type &&
            canCreate && (
              <Button onClick={() => setModalOpen(true)}>
                Створити локацію
              </Button>
            )
          }
        />
      )}

      {!loading && !error && locations.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {locations.map((l) => (
            <LocationCard key={l.id} location={l} />
          ))}
        </div>
      )}

      <CreateLocationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleCreated}
        locations={allLocations}
      />
    </div>
  );
}
