import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { Modal } from "../ui/Modal.jsx";
import { Input } from "../ui/Input.jsx";
import { Textarea } from "../ui/Textarea.jsx";
import { Button } from "../ui/Button.jsx";
import { Badge } from "../ui/Badge.jsx";
import { Loader } from "../ui/Loader.jsx";
import { eventsApi } from "../../api/events.api.js";
import { charactersApi } from "../../api/characters.api.js";
import { usePermissions } from "../../hooks/usePermissions.js";

export function EventDetailModal({
  open,
  onClose,
  event,
  locations = [],
  onUpdated,
  onDeleted,
}) {
  const { projectId } = useParams();
  const { canEdit, canDelete, canCreate } = usePermissions();

  const [mode, setMode] = useState("view"); // view | edit
  const [form, setForm] = useState({
    title: "",
    date: "",
    description: "",
    locationId: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [links, setLinks] = useState([]);
  const [linksLoading, setLinksLoading] = useState(false);
  const [allCharacters, setAllCharacters] = useState([]);
  const [linkModalOpen, setLinkModalOpen] = useState(false);

  useEffect(() => {
    if (open && event) {
      setMode("view");
      setForm({
        title: event.title || "",
        date: event.date || "",
        description: event.description || "",
        locationId: event.locationId ? String(event.locationId) : "",
      });
      setErrors({});
      setServerError("");

      // Завантажуємо зв’язки
      setLinksLoading(true);
      Promise.all([
        eventsApi.listCharactersForEvent(projectId, event.id),
        charactersApi.list(projectId, {}),
      ])
        .then(([{ links }, { characters }]) => {
          setLinks(links);
          setAllCharacters(characters);
        })
        .catch(() => {})
        .finally(() => setLinksLoading(false));
    }
  }, [open, event, projectId]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setServerError("");
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Введіть назву";
    else if (form.title.length > 150) next.title = "Максимум 150 символів";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError("");
    try {
      const { event: updated } = await eventsApi.update(projectId, event.id, {
        title: form.title.trim(),
        date: form.date.trim() || null,
        description: form.description.trim() || null,
        locationId: form.locationId ? Number(form.locationId) : null,
      });
      onUpdated?.(updated);
      setMode("view");
    } catch (err) {
      setServerError(err.response?.data?.error || "Не вдалося оновити подію");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await eventsApi.remove(projectId, event.id);
      onDeleted?.(event.id);
      onClose();
    } catch (err) {
      alert(err.response?.data?.error || "Не вдалося видалити подію");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteLink = async (linkId) => {
    if (!confirm("Видалити цього персонажа з події?")) return;
    try {
      await eventsApi.deleteLink(projectId, linkId);
      setLinks((prev) => prev.filter((l) => l.id !== linkId));
    } catch (err) {
      alert(err.response?.data?.error || "Не вдалося видалити зв’язок");
    }
  };

  if (!event) return null;

  const linkedIds = new Set(links.map((l) => String(l.characterId)));
  const availableCharacters = allCharacters.filter(
    (c) => !linkedIds.has(String(c.id)),
  );

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={mode === "view" ? event.title : "Редагувати подію"}
        footer={
          mode === "view" ? (
            <>
              {canDelete && (
                <Button variant="danger" onClick={() => setDeleteOpen(true)}>
                  Видалити
                </Button>
              )}
              {canEdit && (
                <Button variant="secondary" onClick={() => setMode("edit")}>
                  Редагувати
                </Button>
              )}
              <Button variant="ghost" onClick={onClose}>
                Закрити
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => setMode("view")}
                disabled={submitting}
              >
                Скасувати
              </Button>
              <Button onClick={handleSave} disabled={submitting}>
                {submitting ? "Збереження..." : "Зберегти"}
              </Button>
            </>
          )
        }
      >
        {serverError && (
          <div className="mb-4 px-3 py-2 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
            {serverError}
          </div>
        )}

        {mode === "view" ? (
          <div className="flex flex-col gap-4">
            {/* Метадані */}
            <div className="flex flex-wrap items-center gap-2">
              {event.date && <Badge color="yellow">📅 {event.date}</Badge>}
              {event.location && (
                <Link
                  to={`/projects/${projectId}/locations/${event.location.id}`}
                >
                  <Badge color="blue">📍 {event.location.name}</Badge>
                </Link>
              )}
            </div>

            {event.description && (
              <p className="text-slate-200 whitespace-pre-wrap">
                {event.description}
              </p>
            )}

            {/* Персонажі */}
            <div className="border-t border-slate-700 pt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-slate-400 uppercase">
                  Персонажі ({links.length})
                </h3>
                {canCreate && availableCharacters.length > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setLinkModalOpen(true)}
                  >
                    + Додати
                  </Button>
                )}
              </div>

              {linksLoading ? (
                <Loader message="Завантаження..." />
              ) : links.length === 0 ? (
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
                        {link.role && <Badge color="gray">{link.role}</Badge>}
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

            <div className="text-xs text-slate-500 border-t border-slate-700 pt-3">
              Створено: {new Date(event.createdAt).toLocaleString("uk-UA")}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <Input
              label="Назва *"
              value={form.title}
              onChange={handleChange("title")}
              error={errors.title}
            />

            <Input
              label="Дата або період"
              value={form.date}
              onChange={handleChange("date")}
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm text-slate-300">Локація</label>
              <select
                value={form.locationId}
                onChange={handleChange("locationId")}
                className="bg-slate-800 border border-slate-700 text-slate-100 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="">— Немає —</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} {l.type ? `(${l.type})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <Textarea
              label="Опис"
              value={form.description}
              onChange={handleChange("description")}
              rows={4}
            />
          </form>
        )}
      </Modal>

      {/* Модалка підтвердження видалення */}
      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Видалити подію?"
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
          Ви впевнені, що хочете видалити подію{" "}
          <strong className="text-slate-100">{event.title}</strong>?
        </p>
      </Modal>

      {/* Модалка додавання персонажа */}
      <AddEventCharacterModal
        open={linkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        projectId={projectId}
        eventId={event.id}
        characters={availableCharacters}
        onCreated={(link) => {
          setLinks((prev) => [...prev, link]);
          setLinkModalOpen(false);
        }}
      />
    </>
  );
}

/* ────── Модалка додавання персонажа до події ────── */

function AddEventCharacterModal({
  open,
  onClose,
  projectId,
  eventId,
  characters,
  onCreated,
}) {
  const [characterId, setCharacterId] = useState("");
  const [role, setRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setCharacterId("");
      setRole("");
      setError("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!characterId) {
      setError("Оберіть персонажа");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const { link } = await eventsApi.addCharacter(projectId, {
        eventId: Number(eventId),
        characterId: Number(characterId),
        role: role.trim() || undefined,
      });
      onCreated(link);
    } catch (err) {
      setError(err.response?.data?.error || "Не вдалося додати персонажа");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Додати персонажа до події"
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

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-300">Персонаж</label>
          <select
            value={characterId}
            onChange={(e) => setCharacterId(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-100 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="">— Обрати —</option>
            {characters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-300">
            Роль у події (необов’язково)
          </label>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Учасник, Свідок, Противник..."
            className="bg-slate-800 border border-slate-700 text-slate-100 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
    </Modal>
  );
}
