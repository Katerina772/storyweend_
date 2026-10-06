import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Modal } from "../ui/Modal.jsx";
import { Input } from "../ui/Input.jsx";
import { Textarea } from "../ui/Textarea.jsx";
import { Button } from "../ui/Button.jsx";
import { factionsApi } from "../../api/factions.api.js";

export function EditFactionModal({ open, onClose, faction, onUpdated }) {
  const { projectId } = useParams();
  const [form, setForm] = useState({
    name: "",
    symbol: "",
    description: "",
    history: "",
    leader: "",
    territory: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && faction) {
      setForm({
        name: faction.name || "",
        symbol: faction.symbol || "",
        description: faction.description || "",
        history: faction.history || "",
        leader: faction.leader || "",
        territory: faction.territory || "",
      });
      setErrors({});
      setServerError("");
    }
  }, [open, faction]);

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
      const { faction: updated } = await factionsApi.update(
        projectId,
        faction.id,
        {
          name: form.name.trim(),
          symbol: form.symbol.trim() || null,
          description: form.description.trim() || null,
          history: form.history.trim() || null,
          leader: form.leader.trim() || null,
          territory: form.territory.trim() || null,
        },
      );
      onUpdated?.(updated);
      onClose();
    } catch (err) {
      setServerError(err.response?.data?.error || "Не вдалося оновити фракцію");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Редагувати фракцію"
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
          value={form.name}
          onChange={handleChange("name")}
          error={errors.name}
        />

        <Input
          label="Символ (URL)"
          value={form.symbol}
          onChange={handleChange("symbol")}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Лідер"
            value={form.leader}
            onChange={handleChange("leader")}
          />
          <Input
            label="Територія"
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
