import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Modal } from "../ui/Modal.jsx";
import { Input } from "../ui/Input.jsx";
import { Textarea } from "../ui/Textarea.jsx";
import { Button } from "../ui/Button.jsx";
import { locationsApi } from "../../api/locations.api.js";

const TYPES = [
  "Країна",
  "Регіон",
  "Місто",
  "Село",
  "Замок",
  "Фортеця",
  "Ліс",
  "Гора",
  "Острів",
  "Руїни",
  "Храм",
  "Вежа",
  "Печера",
  "Інше",
];

const EMPTY = {
  name: "",
  type: "",
  parentId: "",
  population: "",
  image: "",
  description: "",
  history: "",
};

export function CreateLocationModal({
  open,
  onClose,
  onCreated,
  locations = [],
}) {
  const { projectId } = useParams();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(EMPTY);
      setErrors({});
      setServerError("");
    }
  }, [open]);

  const handleClose = () => {
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
    else if (form.name.length > 100) next.name = "Максимум 100 символів";

    if (form.population !== "" && form.population !== null) {
      const pop = Number(form.population);
      if (!Number.isInteger(pop) || pop < 0) {
        next.population = "Має бути невід'ємне ціле число";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError("");
    try {
      const payload = {
        name: form.name.trim(),
        type: form.type || undefined,
        image: form.image.trim() || undefined,
        description: form.description.trim() || undefined,
        history: form.history.trim() || undefined,
        parentId: form.parentId ? Number(form.parentId) : undefined,
        population:
          form.population !== "" && form.population !== null
            ? Number(form.population)
            : undefined,
      };

      const { location } = await locationsApi.create(projectId, payload);
      onCreated?.(location);
      handleClose();
    } catch (err) {
      setServerError(
        err.response?.data?.error || "Не вдалося створити локацію",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Створити локацію"
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
          label="Назва *"
          placeholder="Еларія"
          value={form.name}
          onChange={handleChange("name")}
          error={errors.name}
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-300">Тип</label>
            <select
              value={form.type}
              onChange={handleChange("type")}
              className="bg-slate-800 border border-slate-700 text-slate-100 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">— Обрати —</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-300">
              Розташована в (батьківська локація)
            </label>
            <select
              value={form.parentId}
              onChange={handleChange("parentId")}
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
        </div>

        <Input
          label="Населення"
          type="number"
          min="0"
          placeholder="50000"
          value={form.population}
          onChange={handleChange("population")}
          error={errors.population}
        />

        <Input
          label="Зображення (URL)"
          placeholder="https://..."
          value={form.image}
          onChange={handleChange("image")}
        />

        <Textarea
          label="Короткий опис"
          placeholder="Столиця північного королівства..."
          value={form.description}
          onChange={handleChange("description")}
          rows={2}
        />

        <Textarea
          label="Історія"
          placeholder="Заснована 1200 року..."
          value={form.history}
          onChange={handleChange("history")}
          rows={3}
        />
      </form>
    </Modal>
  );
}
