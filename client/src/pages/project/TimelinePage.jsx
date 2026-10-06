import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useProjectContext } from "../../hooks/useProjectContext.js";
import { usePermissions } from "../../hooks/usePermissions.js";
import { eventsApi } from "../../api/events.api.js";
import { locationsApi } from "../../api/locations.api.js";
import { CreateEventModal } from "../../components/project/CreateEventModal.jsx";
import { EventDetailModal } from "../../components/project/EventDetailModal.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Loader } from "../../components/ui/Loader.jsx";
import { EmptyState } from "../../components/ui/EmptyState.jsx";
import { Badge } from "../../components/ui/Badge.jsx";

export default function TimelinePage() {
  const { projectId } = useParams();
  const project = useProjectContext();
  const { canCreate } = usePermissions();

  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const filters = {};
      if (search.trim()) filters.search = search.trim();
      if (locationFilter) filters.locationId = locationFilter;

      const [{ events }, { locations }] = await Promise.all([
        eventsApi.list(projectId, filters),
        locationsApi.list(projectId, {}),
      ]);
      setEvents(events);
      setLocations(locations);
    } catch (err) {
      setError(err.response?.data?.error || "Не вдалося завантажити події");
    } finally {
      setLoading(false);
    }
  }, [projectId, search, locationFilter]);

  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [load]);

  const handleCreated = (event) => {
    setEvents((prev) => {
      const next = [...prev, event];
      // Сортуємо за датою
      return next.sort((a, b) => {
        const da = a.date || "";
        const db = b.date || "";
        return da.localeCompare(db);
      });
    });
  };

  const handleUpdated = (updated) => {
    setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    setSelectedEvent(updated);
  };

  const handleDeleted = (deletedId) => {
    setEvents((prev) => prev.filter((e) => e.id !== deletedId));
    setSelectedEvent(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            Хронологія подій
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {events.length} подій у проєкті «{project.name}»
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => setCreateOpen(true)}>+ Створити подію</Button>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Input
          placeholder="Пошук за назвою, датою або описом..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-100 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
        >
          <option value="">Усі локації</option>
          {locations.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
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

      {!loading && !error && events.length === 0 && (
        <EmptyState
          icon="📜"
          title={
            search || locationFilter ? "Нічого не знайдено" : "Ще немає подій"
          }
          description={
            search || locationFilter
              ? "Спробуйте змінити фільтри."
              : canCreate
                ? "Створіть першу подію — заснування королівства, початок війни, народження героя."
                : "Коли власник додасть події, вони з'являться тут."
          }
          action={
            !search &&
            !locationFilter &&
            canCreate && (
              <Button onClick={() => setCreateOpen(true)}>
                Створити подію
              </Button>
            )
          }
        />
      )}

      {!loading && !error && events.length > 0 && (
        <div className="relative pl-8">
          {/* Вертикальна лінія */}
          <div className="absolute left-3 top-2 bottom-2 w-px bg-slate-700" />

          <div className="flex flex-col gap-6">
            {events.map((event) => (
              <div key={event.id} className="relative">
                {/* Точка на лінії */}
                <div className="absolute -left-[22px] top-2 w-3 h-3 rounded-full bg-blue-500 border-2 border-slate-950" />

                <button
                  onClick={() => setSelectedEvent(event)}
                  className="w-full text-left bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      {event.date && (
                        <div className="text-xs text-slate-500 mb-1">
                          {event.date}
                        </div>
                      )}
                      <h3 className="text-lg font-semibold text-slate-100">
                        {event.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {event.location && (
                        <Badge color="blue">📍 {event.location.name}</Badge>
                      )}
                      {event._count?.characters > 0 && (
                        <Badge color="purple">
                          👤 {event._count.characters}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {event.description && (
                    <p className="text-sm text-slate-400 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <CreateEventModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={handleCreated}
        locations={locations}
      />

      <EventDetailModal
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
        locations={locations}
        onUpdated={handleUpdated}
        onDeleted={handleDeleted}
      />
    </div>
  );
}
