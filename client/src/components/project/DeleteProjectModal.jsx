import { useState, useEffect } from "react";
import { Modal } from "../ui/Modal.jsx";
import { Input } from "../ui/Input.jsx";
import { Button } from "../ui/Button.jsx";

export function DeleteProjectModal({ open, onClose, projectName, onConfirm }) {
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (open) {
      setConfirmText("");
      setDeleting(false);
    }
  }, [open]);

  const canDelete = confirmText === projectName;

  const handleDelete = async () => {
    if (!canDelete) return;
    setDeleting(true);
    try {
      await onConfirm();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Видалити проєкт?"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={deleting}>
            Скасувати
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={!canDelete || deleting}
          >
            {deleting ? "Видалення..." : "Видалити назавжди"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="px-3 py-2 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          ⚠️ Цю дію не можна скасувати. Усі персонажі, локації, фракції, події,
          лор, зв’язки та маркери будуть видалені.
        </div>

        <p className="text-slate-300">
          Щоб підтвердити, введіть назву проєкту:{" "}
          <strong className="text-slate-100">{projectName}</strong>
        </p>

        <Input
          placeholder={projectName}
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          autoFocus
        />
      </div>
    </Modal>
  );
}
