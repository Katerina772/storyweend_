import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Modal } from "../ui/Modal.jsx";
import { Input } from "../ui/Input.jsx";
import { Button } from "../ui/Button.jsx";
import { projectsApi } from "../../api/projects.api.js";
import { ASSIGNABLE_ROLES, getRoleInfo } from "../../utils/projectRoles.js";

export function InviteMemberModal({
  open,
  onClose,
  onCreated,
  existingEmails = [],
}) {
  const { projectId } = useParams();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("VIEWER");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setEmail("");
      setRole("VIEWER");
      setError("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError("Введіть email");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Некоректний email");
      return;
    }
    if (existingEmails.includes(email.trim().toLowerCase())) {
      setError("Цей користувач вже є учасником проєкту");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const { member } = await projectsApi.addMember(projectId, {
        email: email.trim(),
        role,
      });
      onCreated?.(member);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Не вдалося додати учасника");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Запросити учасника"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Скасувати
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Запрошення..." : "Запросити"}
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
        <Input
          label="Email користувача *"
          type="email"
          placeholder="user@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-300">Роль у проєкті</label>
          <div className="flex flex-col gap-2">
            {ASSIGNABLE_ROLES.map((r) => {
              const info = getRoleInfo(r);
              const selected = role === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`text-left px-3 py-2 rounded border transition ${
                    selected
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-slate-700 bg-slate-800 hover:bg-slate-750"
                  }`}
                >
                  <div className="font-medium text-slate-100 text-sm">
                    {info.label}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {info.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Користувач має бути зареєстрований на платформі. Він отримає внутрішнє
          сповіщення про запрошення.
        </p>
      </div>
    </Modal>
  );
}
