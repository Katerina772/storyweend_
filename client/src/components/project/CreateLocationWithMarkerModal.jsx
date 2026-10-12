import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Modal } from "../ui/Modal.jsx";
import { Input } from "../ui/Input.jsx";
import { Textarea } from "../ui/Textarea.jsx";
import { Button } from "../ui/Button.jsx";
import { mapApi } from "../../api/map.api.js";

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

export function CreateLocationWithMarkerModal({
  open,
  onClose,
  coordinates,
  locations = [],
  onCreated,
}) {
  const { projectId } = useParams();
  const [form, setForm] = useState({
    name: "",
    type: "",
    description: "",
    parentId: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({ name: "", type: "", description: "", parentId: "" });
      setErrors({});
      setServerError("");
    }
  }, [open]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setServerError("");
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Введіть назву";
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
      const { marker } = await mapApi.createLocationWithMarker(projectId, {
        name: form.name.trim(),
        type: form.type || undefined,
        description: form.description.trim() || undefined,
        parentId: form.parentId ? Number(form.parentId) : undefined,
        x: coordinates.x,
        y: coordinates.y,
      });
      onCreated?.(marker);
      onClose();
    } catch (err) {
      setServerError(
        err.response?.data?.error || "Не вдалося створити локацію",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!coordinates) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Нова локація на карті"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
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

      <div className="mb-4 px-3 py-2 rounded bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm">
        📍 Координати: x={coordinates.x.toFixed(2)}%, y=
        {coordinates.y.toFixed(2)}%
      </div>

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
            <label className="text-sm text-slate-300">Розташована в</label>
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

        <Textarea
          label="Короткий опис"
          value={form.description}
          onChange={handleChange("description")}
          rows={3}
        />
      </form>
    </Modal>
  );
}
