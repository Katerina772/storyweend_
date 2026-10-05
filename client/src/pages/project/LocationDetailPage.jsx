import { useEffect, useState, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { locationsApi } from "../../api/locations.api.js";
import { charactersApi } from "../../api/characters.api.js";
import { EditLocationModal } from "../../components/project/EditLocationModal.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Loader } from "../../components/ui/Loader.jsx";
import { Modal } from "../../components/ui/Modal.jsx";
import { EmptyState } from "../../components/ui/EmptyState.jsx";
import { usePermissions } from "../../hooks/usePermissions.js";

const LINK_TYPES = [
  "hometown",
  "current",
  "workplace",
  "important",
  "birthplace",
  "other",
];

export default function LocationDetailPage() {
  const { projectId, locationId } = useParams();
  const navigate = useNavigate();
  const { canEdit, canDelete, canCreate } = usePermissions();

  const [location, setLocation] = useState(null);
  const [children, setChildren] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [allCharacters, setAllCharacters] = useState([]);
  const [links, setLinks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [
        { location },
        { locations: kids },
        { locations: allLocs },
        { characters },
        { links },
      ] = await Promise.all([
        locationsApi.getOne(projectId, locationId),
        locationsApi.listChildren(projectId, locationId),
        locationsApi.list(projectId, {}),
        charactersApi.list(projectId, {}),
        locationsApi.listLinksForLocation(projectId, locationId),
      ]);
      setLocation(location);
      setChildren(kids);
      setAllLocations(allLocs);
      setAllCharacters(characters);
      setLinks(links);
    } catch (err) {
      setError(err.response?.data?.error || "Не вдалося завантажити локацію");
    } finally {
      setLoading(false);
    }
  }, [projectId, locationId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await locationsApi.remove(projectId, locationId);
      navigate(`/projects/${projectId}/locations`);
    } catch (err) {
      alert(err.response?.data?.error || "Не вдалося видалити локацію");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteLink = async (linkId) => {
    if (!confirm("Видалити зв’язок?")) return;
    try {
      await locationsApi.deleteLink(projectId, linkId);
      setLinks((prev) => prev.filter((l) => l.id !== linkId));
    } catch (err) {
      alert(err.response?.data?.error || "Не вдалося видалити зв’язок");
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div>
        <div className="px-3 py-2 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-sm mb-4">
          {error}
        </div>
        <Link
          to={`/projects/${projectId}/locations`}
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          ← Назад до локацій
        </Link>
      </div>
    );
  }

  if (!location) return null;

  return (
    <div>
      {/* Хлібні крихти */}
      <div className="mb-4 text-sm text-slate-400">
        <Link
          to={`/projects/${projectId}/locations`}
          className="hover:text-slate-200"
        >
          ← Локації
        </Link>
      </div>

      {/* Заголовок */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
            {location.image ? (
              <img
                src={location.image}
                alt={location.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl text-slate-700">🗺️</span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              {location.name}
            </h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {location.type && <Badge color="blue">{location.type}</Badge>}
              {location.population != null && (
                <Badge color="green">
                  👥 {location.population.toLocaleString("uk-UA")}
                </Badge>
              )}
              {location.parent && (
                <Link
                  to={`/projects/${projectId}/locations/${location.parent.id}`}
                >
                  <Badge color="gray">↳ {location.parent.name}</Badge>
                </Link>
              )}
            </div>
          </div>
        </div>

        {(canEdit || canDelete) && (
          <div className="flex gap-2">
            {canEdit && (
              <Button variant="secondary" onClick={() => setEditOpen(true)}>
                Редагувати
              </Button>
            )}
            {canDelete && (
              <Button variant="danger" onClick={() => setDeleteOpen(true)}>
                Видалити
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Опис */}
      {location.description && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 mb-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase mb-2">
            Опис
          </h2>
          <p className="text-slate-200 whitespace-pre-wrap">
            {location.description}
          </p>
        </div>
      )}

      {/* Історія */}
      {location.history && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 mb-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase mb-2">
            Історія
          </h2>
          <p className="text-slate-200 whitespace-pre-wrap">
            {location.history}
          </p>
        </div>
      )}

      {/* Дочірні локації */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 mb-4">
        <h2 className="text-sm font-semibold text-slate-400 uppercase mb-3">
          Дочірні локації ({children.length})
        </h2>
        {children.length === 0 ? (
          <p className="text-slate-500 italic text-sm">
            Немає вкладених локацій.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {children.map((c) => (
              <Link key={c.id} to={`/projects/${projectId}/locations/${c.id}`}>
                <Badge color="purple">
                  {c.name} {c.type ? `· ${c.type}` : ""}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Пов’язані персонажі */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-400 uppercase">
            Пов’язані персонажі ({links.length})
          </h2>
          {canCreate && (
            <Button size="sm" onClick={() => setLinkOpen(true)}>
              + Додати
            </Button>
          )}
        </div>

        {links.length === 0 ? (
          <p className="text-slate-500 italic text-sm">
            Немає пов’язаних персонажів.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between bg-slate-800 rounded px-3 py-2"
              >
                <Link
                  to={`/projects/${projectId}/characters/${link.character.id}`}
                  className="text-slate-200 hover:text-blue-400"
                >
                  {link.character.name}
                </Link>
                <div className="flex items-center gap-2">
                  {link.type && <Badge color="gray">{link.type}</Badge>}
                  {canDelete && (
                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Метадані */}
      <div className="text-xs text-slate-500 mt-8">
        Створено: {new Date(location.createdAt).toLocaleString("uk-UA")}
      </div>

      {/* Модалка редагування */}
      <EditLocationModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        location={location}
        locations={allLocations}
        onUpdated={(updated) => setLocation(updated)}
      />

      {/* Модалка видалення */}
      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Видалити локацію?"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setDeleteOpen(false)}
              disabled={deleting}
            >
              Скасувати
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Видалення..." : "Видалити"}
            </Button>
          </>
        }
      >
        <p>
          Ви впевнені, що хочете видалити{" "}
          <strong className="text-slate-100">{location.name}</strong>?
        </p>
        <p className="text-sm text-slate-400 mt-2">
          Дочірні локації не буде видалено — у них просто зникне батьківська
          прив’язка. Зв’язки з персонажами, подіями та маркери на карті буде
          видалено.
        </p>
      </Modal>

      {/* Модалка додавання зв’язку */}
      <AddLocationLinkModal
        open={linkOpen}
        onClose={() => setLinkOpen(false)}
        projectId={projectId}
        locationId={locationId}
        characters={allCharacters}
        existingLinks={links}
        onCreated={(link) => {
          setLinks((prev) => [...prev, link]);
          setLinkOpen(false);
        }}
      />
    </div>
  );
}

/* ────── Допоміжна модалка для додавання зв’язку ────── */

function AddLocationLinkModal({
  open,
  onClose,
  projectId,
  locationId,
  characters,
  existingLinks,
  onCreated,
}) {
  const [characterId, setCharacterId] = useState("");
  const [type, setType] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setCharacterId("");
      setType("");
      setError("");
    }
  }, [open]);

  const linkedCharacterIds = new Set(
    existingLinks.map((l) => String(l.characterId)),
  );
  const availableCharacters = characters.filter(
    (c) => !linkedCharacterIds.has(String(c.id)),
  );

  const handleSubmit = async () => {
    if (!characterId) {
      setError("Оберіть персонажа");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const { link } = await locationsApi.linkCharacter(projectId, {
        characterId: Number(characterId),
        locationId: Number(locationId),
        type: type.trim() || undefined,
      });
      onCreated(link);
    } catch (err) {
      setError(err.response?.data?.error || "Не вдалося створити зв’язок");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Додати персонажа до локації"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Скасувати
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Додавання..." : "Додати"}
          </Button>
        </>
      }
    >
      {error && (
        <div className="mb-4 px-3 py-2 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      {availableCharacters.length === 0 ? (
        <p className="text-slate-400 text-sm">
          Усі персонажі вже пов’язані з цією локацією.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-300">Персонаж</label>
            <select
              value={characterId}
              onChange={(e) => setCharacterId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-100 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">— Обрати —</option>
              {availableCharacters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-300">
              Тип зв’язку (необов’язково)
            </label>
            <input
              list="link-types"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="hometown, current, workplace..."
              className="bg-slate-800 border border-slate-700 text-slate-100 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
            />
            <datalist id="link-types">
              {LINK_TYPES.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </div>
        </div>
      )}
    </Modal>
  );
}
