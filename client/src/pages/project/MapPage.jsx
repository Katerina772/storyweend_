import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useProjectContext } from "../../hooks/useProjectContext.js";
import { usePermissions } from "../../hooks/usePermissions.js";
import { mapApi } from "../../api/map.api.js";
import { locationsApi } from "../../api/locations.api.js";
import { MapCanvas } from "../../components/project/MapCanvas.jsx";
import { MapImageModal } from "../../components/project/MapImageModal.jsx";
import { CreateLocationWithMarkerModal } from "../../components/project/CreateLocationWithMarkerModal.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Loader } from "../../components/ui/Loader.jsx";
import { EmptyState } from "../../components/ui/EmptyState.jsx";

export default function MapPage() {
  const { projectId } = useParams();
  const project = useProjectContext();
  const { canCreate, canEdit } = usePermissions();

  const [mapImageUrl, setMapImageUrl] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [pendingCoords, setPendingCoords] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [{ mapImageUrl, markers }, { locations }] = await Promise.all([
        mapApi.getMap(projectId),
        locationsApi.list(projectId, {}),
      ]);
      setMapImageUrl(mapImageUrl);
      setMarkers(markers);
      setAllLocations(locations);
    } catch (err) {
      setError(err.response?.data?.error || "Не вдалося завантажити карту");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleMapClick = (x, y) => {
    if (!canCreate) return;
    setPendingCoords({ x, y });
  };

  const handleMarkerCreated = (marker) => {
    setMarkers((prev) => [...prev, marker]);
    setAllLocations((prev) => [marker.location, ...prev]);
  };

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const handleDeleteMarker = async (markerId) => {
    if (!confirm("Видалити маркер з карти? (Локація залишиться)")) return;
    try {
      await mapApi.deleteMarker(projectId, markerId);
      setMarkers((prev) => prev.filter((m) => m.id !== markerId));
      if (selectedMarker?.id === markerId) setSelectedMarker(null);
    } catch (err) {
      alert(err.response?.data?.error || "Не вдалося видалити маркер");
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="px-3 py-2 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Карта світу</h1>
          <p className="text-sm text-slate-400 mt-1">
            {markers.length} маркерів на карті «{project.name}»
          </p>
        </div>
        {canEdit && (
          <Button variant="secondary" onClick={() => setImageModalOpen(true)}>
            {mapImageUrl ? "Змінити карту" : "Завантажити карту"}
          </Button>
        )}
      </div>

      {/* Карта або порожній стан */}
      {!mapImageUrl ? (
        <EmptyState
          icon="🗺️"
          title="Карта ще не налаштована"
          description={
            canEdit
              ? "Завантажте зображення карти світу, щоб розміщувати на ній локації."
              : "Коли власник додасть карту, ви зможете її побачити тут."
          }
          action={
            canEdit && (
              <Button onClick={() => setImageModalOpen(true)}>
                Завантажити карту
              </Button>
            )
          }
        />
      ) : (
        <div className="flex-1 flex gap-4 min-h-0">
          {/* Полотно */}
          <div className="flex-1 min-h-[600px]">
            <MapCanvas
              mapImageUrl={mapImageUrl}
              markers={markers}
              canCreate={canCreate}
              onMapClick={handleMapClick}
              onMarkerClick={handleMarkerClick}
              selectedMarkerId={selectedMarker?.id}
            />
          </div>

          {/* Панель обраного маркера */}
          {selectedMarker && (
            <div className="w-80 shrink-0 bg-slate-900 border border-slate-800 rounded-lg p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-100 line-clamp-1">
                  {selectedMarker.location?.name}
                </h3>
                <button
                  onClick={() => setSelectedMarker(null)}
                  className="text-slate-400 hover:text-slate-100"
                >
                  ✕
                </button>
              </div>

              {selectedMarker.location?.type && (
                <Badge color="blue" className="mb-3">
                  {selectedMarker.location.type}
                </Badge>
              )}

              {selectedMarker.location?.description && (
                <p className="text-sm text-slate-300 mb-4">
                  {selectedMarker.location.description}
                </p>
              )}

              <div className="flex flex-col gap-2">
                <Link
                  to={`/projects/${projectId}/locations/${selectedMarker.location.id}`}
                >
                  <Button variant="secondary" className="w-full">
                    Відкрити локацію
                  </Button>
                </Link>

                {canEdit && (
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteMarker(selectedMarker.id)}
                    className="w-full"
                  >
                    Видалити маркер
                  </Button>
                )}
              </div>

              <div className="text-xs text-slate-500 mt-4">
                Координати: x={Number(selectedMarker.x).toFixed(1)}%, y=
                {Number(selectedMarker.y).toFixed(1)}%
              </div>
            </div>
          )}
        </div>
      )}

      {/* Підказка */}
      {mapImageUrl && canCreate && (
        <div className="text-xs text-slate-500 mt-3 text-center">
          💡 Клікніть на карту, щоб створити локацію. Клікніть на маркер, щоб
          переглянути деталі.
        </div>
      )}

      {/* Модалки */}
      <MapImageModal
        open={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        currentImageUrl={mapImageUrl}
        onUpdated={(newUrl) => setMapImageUrl(newUrl)}
      />

      <CreateLocationWithMarkerModal
        open={!!pendingCoords}
        onClose={() => setPendingCoords(null)}
        coordinates={pendingCoords}
        locations={allLocations}
        onCreated={handleMarkerCreated}
      />
    </div>
  );
}
