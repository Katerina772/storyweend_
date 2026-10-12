import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Modal } from "../../ui/Modal.jsx";
import { Textarea } from "../../ui/Textarea.jsx";
import { Button } from "../../ui/Button.jsx";
import { relationsApi } from "../../../api/relations.api.js";
import {
  RELATION_TYPES_LIST,
  getRelationInfo,
} from "../../../utils/relationTypes.js";

export function RelationModal({
  open,
  onClose,
  characters,
  editingRelation,
  onCreated,
  onUpdated,
  onDeleted,
}) {
  const { projectId } = useParams();
  const [form, setForm] = useState({
    characterFromId: "",
    characterToId: "",
    type: "FRIEND",
    description: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isEdit = !!editingRelation;

  useEffect(() => {
    if (open) {
      if (editingRelation) {
        setForm({
          characterFromId: String(editingRelation.characterFromId),
          characterToId: String(editingRelation.characterToId),
          type: editingRelation.type,
          description: editingRelation.description || "",
        });
      } else {
        setForm({
          characterFromId: "",
          characterToId: "",
          type: "FRIEND",
          description: "",
        });
      }
      setError("");
      setDeleteOpen(false);
    }
  }, [open, editingRelation]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError("");
  };

  const handleSubmit = async () => {
    if (!form.characterFromId || !form.characterToId) {
      setError("Оберіть обох персонажів");
      return;
    }
    if (form.characterFromId === form.characterToId) {
      setError("Персонаж не може бути пов’язаний сам із собою");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      if (isEdit) {
        const { relation } = await relationsApi.update(
          projectId,
          editingRelation.id,
          { type: form.type, description: form.description.trim() || null },
        );
        onUpdated?.(relation);
      } else {
        const { relation } = await relationsApi.create(projectId, {
          characterFromId: Number(form.characterFromId),
          characterToId: Number(form.characterToId),
          type: form.type,
          description: form.description.trim() || undefined,
        });
        onCreated?.(relation);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Не вдалося зберегти зв’язок");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await relationsApi.remove(projectId, editingRelation.id);
      onDeleted?.(editingRelation.id);
      onClose();
    } catch (err) {
      alert(err.response?.data?.error || "Не вдалося видалити зв’язок");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Modal
        open={open && !deleteOpen}
        onClose={onClose}
        title={isEdit ? "Редагувати зв’язок" : "Створити зв’язок"}
        footer={
          <>
            {isEdit && (
              <Button
                variant="danger"
                onClick={() => setDeleteOpen(true)}
                disabled={submitting}
              >
                Видалити
              </Button>
            )}
            <Button variant="ghost" onClick={onClose} disabled={submitting}>
              Скасувати
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Збереження..." : isEdit ? "Зберегти" : "Створити"}
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
          {/* Персонаж 1 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-300">Від кого *</label>
            <select
              value={form.characterFromId}
              onChange={handleChange("characterFromId")}
              disabled={isEdit}
              className="bg-slate-800 border border-slate-700 text-slate-100 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 disabled:opacity-60"
            >
              <option value="">— Обрати —</option>
              {characters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Персонаж 2 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-300">До кого *</label>
            <select
              value={form.characterToId}
              onChange={handleChange("characterToId")}
              disabled={isEdit}
              className="bg-slate-800 border border-slate-700 text-slate-100 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 disabled:opacity-60"
            >
              <option value="">— Обрати —</option>
              {characters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Тип */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-300">Тип зв’язку</label>
            <div className="grid grid-cols-2 gap-2">
              {RELATION_TYPES_LIST.map((t) => {
                const info = getRelationInfo(t);
                const selected = form.type === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, type: t }))}
                    className={`px-3 py-2 rounded border text-sm flex items-center gap-2 transition ${
                      selected
                        ? "border-slate-400 bg-slate-700"
                        : "border-slate-700 bg-slate-800 hover:bg-slate-750"
                    }`}
                    style={{
                      borderColor: selected ? info.color : undefined,
                    }}
                  >
                    <span>{info.emoji}</span>
                    <span
                      style={{ color: selected ? info.color : undefined }}
                      className={selected ? "font-medium" : "text-slate-300"}
                    >
                      {info.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Опис */}
          <Textarea
            label="Опис (необов’язково)"
            value={form.description}
            onChange={handleChange("description")}
            rows={3}
            placeholder="Друзі дитинства, зустрілися в Еларії..."
          />
        </div>
      </Modal>

      {/* Підтвердження видалення */}
      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Видалити зв’язок?"
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
        <p>Ви впевнені, що хочете видалити цей зв’язок?</p>
      </Modal>
    </>
  );
}
