import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Modal } from "../ui/Modal.jsx";
import { Input } from "../ui/Input.jsx";
import { Textarea } from "../ui/Textarea.jsx";
import { Button } from "../ui/Button.jsx";
import { eventsApi } from "../../api/events.api.js";

const EMPTY = {
  title: "",
  date: "",
  description: "",
  locationId: "",
};

export function CreateEventModal({ open, onClose, onCreated, locations = [] }) {
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

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setServerError("");
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Введіть назву події";
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
      const { event } = await eventsApi.create(projectId, {
        title: form.title.trim(),
        date: form.date.trim() || undefined,
        description: form.description.trim() || undefined,
        locationId: form.locationId ? Number(form.locationId) : undefined,
      });
      onCreated?.(event);
      onClose();
    } catch (err) {
      setServerError(err.response?.data?.error || "Не вдалося створити подію");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Створити подію"
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Назва *"
          placeholder="Початок Великої війни"
          value={form.title}
          onChange={handleChange("title")}
          error={errors.title}
        />

        <Input
          label="Дата або період"
          placeholder="1245 рік / Третя епоха / після Великої війни"
          value={form.date}
          onChange={handleChange("date")}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-300">
            Локація (необов’язково)
          </label>
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
          placeholder="Війна між королівством та Темним братством..."
          value={form.description}
          onChange={handleChange("description")}
          rows={3}
        />
      </form>
    </Modal>
  );
}
