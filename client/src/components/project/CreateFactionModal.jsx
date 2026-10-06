import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Modal } from "../ui/Modal.jsx";
import { Input } from "../ui/Input.jsx";
import { Textarea } from "../ui/Textarea.jsx";
import { Button } from "../ui/Button.jsx";
import { factionsApi } from "../../api/factions.api.js";

const EMPTY = {
  name: "",
  symbol: "",
  description: "",
  history: "",
  leader: "",
  territory: "",
};

export function CreateFactionModal({ open, onClose, onCreated }) {
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
      const { faction } = await factionsApi.create(projectId, {
        name: form.name.trim(),
        symbol: form.symbol.trim() || undefined,
        description: form.description.trim() || undefined,
        history: form.history.trim() || undefined,
        leader: form.leader.trim() || undefined,
        territory: form.territory.trim() || undefined,
      });
      onCreated?.(faction);
      onClose();
    } catch (err) {
      setServerError(
        err.response?.data?.error || "Не вдалося створити фракцію",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Створити фракцію"
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
          placeholder="Орден Світла"
          value={form.name}
          onChange={handleChange("name")}
          error={errors.name}
        />

        <Input
          label="Символ (URL)"
          placeholder="https://..."
          value={form.symbol}
          onChange={handleChange("symbol")}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Лідер"
            placeholder="Архімаг Селаріон"
            value={form.leader}
            onChange={handleChange("leader")}
          />
          <Input
            label="Територія"
            placeholder="Вежа Світла"
            value={form.territory}
            onChange={handleChange("territory")}
          />
        </div>

        <Textarea
          label="Опис"
          value={form.description}
          onChange={handleChange("description")}
          rows={2}
        />

        <Textarea
          label="Історія"
          value={form.history}
          onChange={handleChange("history")}
          rows={3}
        />
      </form>
    </Modal>
  );
}
