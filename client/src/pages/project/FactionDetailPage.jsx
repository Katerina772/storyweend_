import { useEffect, useState, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { factionsApi } from "../../api/factions.api.js";
import { charactersApi } from "../../api/characters.api.js";
import { EditFactionModal } from "../../components/project/EditFactionModal.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Loader } from "../../components/ui/Loader.jsx";
import { Modal } from "../../components/ui/Modal.jsx";
import { usePermissions } from "../../hooks/usePermissions.js";

export default function FactionDetailPage() {
  const { projectId, factionId } = useParams();
  const navigate = useNavigate();
  const { canEdit, canDelete, canCreate } = usePermissions();

  const [faction, setFaction] = useState(null);
  const [links, setLinks] = useState([]);
  const [allCharacters, setAllCharacters] = useState([]);
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
      const [{ faction }, { links }, { characters }] = await Promise.all([
        factionsApi.getOne(projectId, factionId),
        factionsApi.listCharactersForFaction(projectId, factionId),
        charactersApi.list(projectId, {}),
      ]);
      setFaction(faction);
      setLinks(links);
      setAllCharacters(characters);
    } catch (err) {
      setError(err.response?.data?.error || "Не вдалося завантажити фракцію");
    } finally {
      setLoading(false);
    }
  }, [projectId, factionId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await factionsApi.remove(projectId, factionId);
      navigate(`/projects/${projectId}/factions`);
    } catch (err) {
      alert(err.response?.data?.error || "Не вдалося видалити фракцію");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteLink = async (linkId) => {
    if (!confirm("Видалити цього персонажа з фракції?")) return;
    try {
      await factionsApi.deleteLink(projectId, linkId);
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
          to={`/projects/${projectId}/factions`}
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          ← Назад до фракцій
        </Link>
      </div>
    );
  }

  if (!faction) return null;

  return (
    <div>
      <div className="mb-4 text-sm text-slate-400">
        <Link
          to={`/projects/${projectId}/factions`}
          className="hover:text-slate-200"
        >
          ← Фракції
        </Link>
      </div>

      {/* Заголовок */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
            {faction.symbol ? (
              <img
                src={faction.symbol}
                alt={faction.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl text-slate-700">🛡️</span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              {faction.name}
            </h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {faction.leader && (
                <Badge color="yellow">👑 {faction.leader}</Badge>
              )}
              {faction.territory && (
                <Badge color="blue">📍 {faction.territory}</Badge>
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

      {faction.description && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 mb-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase mb-2">
            Опис
          </h2>
          <p className="text-slate-200 whitespace-pre-wrap">
            {faction.description}
          </p>
        </div>
      )}

      {faction.history && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 mb-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase mb-2">
            Історія
          </h2>
          <p className="text-slate-200 whitespace-pre-wrap">
            {faction.history}
          </p>
        </div>
      )}

      {/* Учасники */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-400 uppercase">
            Учасники ({links.length})
          </h2>
          {canCreate && (
            <Button size="sm" onClick={() => setLinkOpen(true)}>
              + Додати
            </Button>
          )}
        </div>

        {links.length === 0 ? (
          <p className="text-slate-500 italic text-sm">Немає учасників.</p>
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

      <div className="text-xs text-slate-500 mt-8">
        Створено: {new Date(faction.createdAt).toLocaleString("uk-UA")}
      </div>

      <EditFactionModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        faction={faction}
        onUpdated={(updated) => setFaction(updated)}
      />

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Видалити фракцію?"
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
          Ви впевнені, що хочете видалити фракцію{" "}
          <strong className="text-slate-100">{faction.name}</strong>?
        </p>
        <p className="text-sm text-slate-400 mt-2">
          Усі зв’язки з персонажами також буде видалено.
        </p>
      </Modal>

      <AddFactionMemberModal
        open={linkOpen}
        onClose={() => setLinkOpen(false)}
        projectId={projectId}
        factionId={factionId}
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

/* ─────── Вбудована модалка додавання учасника ─────── */

function AddFactionMemberModal({
  open,
  onClose,
  projectId,
  factionId,
  characters,
  existingLinks,
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

  const linkedIds = new Set(existingLinks.map((l) => String(l.characterId)));
  const available = characters.filter((c) => !linkedIds.has(String(c.id)));

  const handleSubmit = async () => {
    if (!characterId) {
      setError("Оберіть персонажа");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const { link } = await factionsApi.addCharacter(projectId, {
        characterId: Number(characterId),
        factionId: Number(factionId),
        role: role.trim() || undefined,
      });
      onCreated(link);
    } catch (err) {
      setError(err.response?.data?.error || "Не вдалося додати учасника");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Додати учасника"
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

      {available.length === 0 ? (
        <p className="text-slate-400 text-sm">
          Усі персонажі вже у цій фракції.
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
              {available.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-300">
              Роль у фракції (необов’язково)
            </label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Учень, Лорд, Воєначальник..."
              className="bg-slate-800 border border-slate-700 text-slate-100 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      )}
    </Modal>
  );
}
