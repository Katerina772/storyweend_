import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Modal } from "../ui/Modal.jsx";
import { Input } from "../ui/Input.jsx";
import { Textarea } from "../ui/Textarea.jsx";
import { Button } from "../ui/Button.jsx";
import { charactersApi } from "../../api/characters.api.js";

const ALIGNMENTS = [
  { value: "POSITIVE", label: "Позитивний" },
  { value: "NEGATIVE", label: "Негативний" },
  { value: "NEUTRAL", label: "Нейтральний" },
];

const ROLES = [
  "Головний герой",
  "Другорядний персонаж",
  "Антагоніст",
  "Союзник",
  "Наставник",
  "NPC",
];

export function EditCharacterModal({ open, onClose, character, onUpdated }) {
  const { projectId } = useParams();

  const [form, setForm] = useState({
    name: "",
    portrait: "",
    description: "",
    biography: "",
    role: "",
    alignment: "NEUTRAL",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Заповнюємо форму при відкритті
  useEffect(() => {
    if (open && character) {
      setForm({
        name: character.name || "",
        portrait: character.portrait || "",
        description: character.description || "",
        biography: character.biography || "",
        role: character.role || "",
        alignment: character.alignment || "NEUTRAL",
      });
      setErrors({});
      setServerError("");
    }
  }, [open, character]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setServerError("");
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Введіть ім'я";
    else if (form.name.length > 100) next.name = "Максимум 100 символів";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError("");
    try {
      const { character: updated } = await charactersApi.update(
        projectId,
        character.id,
        {
          name: form.name.trim(),
          portrait: form.portrait.trim() || null,
          description: form.description.trim() || null,
          biography: form.biography.trim() || null,
          role: form.role.trim() || null,
          alignment: form.alignment,
        },
      );
      onUpdated?.(updated);
      onClose();
    } catch (err) {
      setServerError(
        err.response?.data?.error || "Не вдалося оновити персонажа",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Редагувати персонажа"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Скасувати
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Збереження..." : "Зберегти"}
          </Button>
        </>
      }
    >
      {serverError && (
        <div className="mb-4 px-3 py-2 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Ім'я *"
          value={form.name}
          onChange={handleChange("name")}
          error={errors.name}
        />

        <Input
          label="Портрет (URL)"
          value={form.portrait}
          onChange={handleChange("portrait")}
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-300">Роль у сюжеті</label>
            <select
              value={form.role}
              onChange={handleChange("role")}
              className="bg-slate-800 border border-slate-700 text-slate-100 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">— Обрати —</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-300">Моральна категорія</label>
            <select
              value={form.alignment}
              onChange={handleChange("alignment")}
              className="bg-slate-800 border border-slate-700 text-slate-100 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              {ALIGNMENTS.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Textarea
          label="Короткий опис"
          value={form.description}
          onChange={handleChange("description")}
          rows={2}
        />

        <Textarea
          label="Біографія"
          value={form.biography}
          onChange={handleChange("biography")}
          rows={4}
        />
      </form>
    </Modal>
  );
}
