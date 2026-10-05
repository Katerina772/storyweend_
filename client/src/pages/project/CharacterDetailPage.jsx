import { useEffect, useState, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { charactersApi } from "../../api/characters.api.js";
import { EditCharacterModal } from "../../components/project/EditCharacterModal.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Loader } from "../../components/ui/Loader.jsx";
import { Modal } from "../../components/ui/Modal.jsx";
import { usePermissions } from "../../hooks/usePermissions.js";

const ALIGNMENT_MAP = {
  POSITIVE: { label: "Позитивний", color: "green" },
  NEGATIVE: { label: "Негативний", color: "red" },
  NEUTRAL: { label: "Нейтральний", color: "gray" },
};

export default function CharacterDetailPage() {
  const { projectId, characterId } = useParams();
  const navigate = useNavigate();
  const { canEdit, canDelete } = usePermissions();

  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadCharacter = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { character } = await charactersApi.getOne(projectId, characterId);
      setCharacter(character);
    } catch (err) {
      setError(err.response?.data?.error || "Не вдалося завантажити персонажа");
    } finally {
      setLoading(false);
    }
  }, [projectId, characterId]);

  useEffect(() => {
    loadCharacter();
  }, [loadCharacter]);

  const handleUpdated = (updated) => {
    setCharacter(updated);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await charactersApi.remove(projectId, characterId);
      navigate(`/projects/${projectId}/characters`);
    } catch (err) {
      alert(err.response?.data?.error || "Не вдалося видалити персонажа");
    } finally {
      setDeleting(false);
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
          to={`/projects/${projectId}/characters`}
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          ← Назад до персонажів
        </Link>
      </div>
    );
  }

  if (!character) return null;

  const align = ALIGNMENT_MAP[character.alignment] || ALIGNMENT_MAP.NEUTRAL;

  return (
    <div>
      {/* Хлібні крихти */}
      <div className="mb-4 text-sm text-slate-400">
        <Link
          to={`/projects/${projectId}/characters`}
          className="hover:text-slate-200"
        >
          ← Персонажі
        </Link>
      </div>

      {/* Заголовок */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
            {character.portrait ? (
              <img
                src={character.portrait}
                alt={character.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl text-slate-700">👤</span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              {character.name}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              {character.role && (
                <span className="text-sm text-slate-400">{character.role}</span>
              )}
              <Badge color={align.color}>{align.label}</Badge>
            </div>
          </div>
        </div>

        {/* Кнопки дій */}
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
      {character.description && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 mb-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase mb-2">
            Короткий опис
          </h2>
          <p className="text-slate-200 whitespace-pre-wrap">
            {character.description}
          </p>
        </div>
      )}

      {/* Біографія */}
      {character.biography && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 mb-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase mb-2">
            Біографія
          </h2>
          <p className="text-slate-200 whitespace-pre-wrap">
            {character.biography}
          </p>
        </div>
      )}

      {/* Порожній стан */}
      {!character.description && !character.biography && (
        <div className="text-slate-500 italic">
          У цього персонажа ще немає опису чи біографії.
        </div>
      )}

      {/* Метадані */}
      <div className="text-xs text-slate-500 mt-8">
        Створено: {new Date(character.createdAt).toLocaleString("uk-UA")}
        {character.updatedAt !== character.createdAt && (
          <>
            {" "}
            · Оновлено: {new Date(character.updatedAt).toLocaleString("uk-UA")}
          </>
        )}
      </div>

      {/* Модалка редагування */}
      <EditCharacterModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        character={character}
        onUpdated={handleUpdated}
      />

      {/* Модалка видалення */}
      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Видалити персонажа?"
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
          Ви впевнені, що хочете видалити персонажа{" "}
          <strong className="text-slate-100">{character.name}</strong>? Цю дію
          не можна скасувати.
        </p>
        <p className="text-sm text-slate-400 mt-2">
          Усі зв’язки цього персонажа з локаціями, фракціями та подіями також
          буде видалено.
        </p>
      </Modal>
    </div>
  );
}
