import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Modal } from "../ui/Modal.jsx";
import { Input } from "../ui/Input.jsx";
import { Textarea } from "../ui/Textarea.jsx";
import { Button } from "../ui/Button.jsx";
import { loreApi } from "../../api/lore.api.js";

export function EditLoreModal({
  open,
  onClose,
  entry,
  onUpdated,
  existingCategories = [],
}) {
  const { projectId } = useParams();

  const [form, setForm] = useState({ title: "", category: "", content: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && entry) {
      setForm({
        title: entry.title || "",
        category: entry.category || "",
        content: entry.content || "",
      });
      setErrors({});
      setServerError("");
    }
  }, [open, entry]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError("");
    try {
      const { lore: updated } = await loreApi.update(projectId, entry.id, {
        title: form.title.trim(),
        category: form.category.trim() || null,
        content: form.content.trim() || null,
      });
      onUpdated?.(updated);
      onClose();
    } catch (err) {
      setServerError(err.response?.data?.error || "Не вдалося оновити запис");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Редагувати запис"
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
          label="Назва *"
          value={form.title}
          onChange={handleChange("title")}
          error={errors.title}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-300">Категорія</label>
          <input
            list="lore-categories-edit"
            value={form.category}
            onChange={handleChange("category")}
            className="bg-slate-800 border border-slate-700 text-slate-100 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
          />
          <datalist id="lore-categories-edit">
            {existingCategories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>

        <Textarea
          label="Вміст"
          value={form.content}
          onChange={handleChange("content")}
          rows={6}
        />
      </form>
    </Modal>
  );
}
