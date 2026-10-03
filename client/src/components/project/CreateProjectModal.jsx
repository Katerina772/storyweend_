import { useState } from "react";
import { Modal } from "../ui/Modal.jsx";
import { Input } from "../ui/Input.jsx";
import { Textarea } from "../ui/Textarea.jsx";
import { Button } from "../ui/Button.jsx";
import { projectsApi } from "../../api/projects.api.js";

export function CreateProjectModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    coverImage: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setForm({ name: "", description: "", coverImage: "" });
    setErrors({});
    setServerError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setServerError("");
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Введіть назву";
    else if (form.name.trim().length < 2) next.name = "Мінімум 2 символи";
    else if (form.name.length > 150) next.name = "Максимум 150 символів";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError("");
    try {
      const { project } = await projectsApi.create({
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        coverImage: form.coverImage.trim() || undefined,
      });
      onCreated?.(project);
      handleClose();
    } catch (err) {
      setServerError(err.response?.data?.error || "Не вдалося створити проєкт");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Створити проєкт"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={submitting}>
            Скасувати
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Створення..." : "Створити"}
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
          label="Назва"
          placeholder="Ельдарія"
          value={form.name}
          onChange={handleChange("name")}
          error={errors.name}
        />

        <Textarea
          label="Опис"
          placeholder="Короткий опис світу (необов'язково)"
          value={form.description}
          onChange={handleChange("description")}
          rows={3}
        />

        <Input
          label="Обкладинка (URL)"
          placeholder="https://... (необов'язково)"
          value={form.coverImage}
          onChange={handleChange("coverImage")}
        />
      </form>
    </Modal>
  );
}
