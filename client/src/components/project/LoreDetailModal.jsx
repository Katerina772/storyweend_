import { useEffect, useState } from "react";
import { Modal } from "../ui/Modal.jsx";
import { Button } from "../ui/Button.jsx";
import { Badge } from "../ui/Badge.jsx";
import { loreApi } from "../../api/lore.api.js";
import { EditLoreModal } from "./EditLoreModal.jsx";
import { usePermissions } from "../../hooks/usePermissions.js";
import { useParams } from "react-router-dom";

export function LoreDetailModal({
  open,
  onClose,
  entry,
  onUpdated,
  onDeleted,
  existingCategories = [],
}) {
  const { projectId } = useParams();
  const { canEdit, canDelete } = usePermissions();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!open) {
      setEditOpen(false);
      setDeleteOpen(false);
    }
  }, [open]);

  if (!entry) return null;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await loreApi.remove(projectId, entry.id);
      onDeleted?.(entry.id);
      onClose();
    } catch (err) {
      alert(err.response?.data?.error || "Не вдалося видалити запис");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Modal
        open={open && !editOpen && !deleteOpen}
        onClose={onClose}
        title={entry.title}
        footer={
          <>
            {canDelete && (
              <Button variant="danger" onClick={() => setDeleteOpen(true)}>
                Видалити
              </Button>
            )}
            {canEdit && (
              <Button variant="secondary" onClick={() => setEditOpen(true)}>
                Редагувати
              </Button>
            )}
            <Button variant="ghost" onClick={onClose}>
              Закрити
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          {entry.category && (
            <div>
              <Badge color="purple">{entry.category}</Badge>
            </div>
          )}

          {entry.content ? (
            <p className="text-slate-200 whitespace-pre-wrap">
              {entry.content}
            </p>
          ) : (
            <p className="text-slate-500 italic">Без вмісту</p>
          )}

          <div className="text-xs text-slate-500 border-t border-slate-700 pt-3">
            Створено: {new Date(entry.createdAt).toLocaleString("uk-UA")}
            {entry.updatedAt !== entry.createdAt && (
              <>
                {" "}
                · Оновлено: {new Date(entry.updatedAt).toLocaleString("uk-UA")}
              </>
            )}
          </div>
        </div>
      </Modal>

      <EditLoreModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        entry={entry}
        onUpdated={(updated) => {
          onUpdated?.(updated);
          setEditOpen(false);
        }}
        existingCategories={existingCategories}
      />

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Видалити запис?"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setDeleteOpen(false)}
              disabled={deleting}
            >
              Скасувати
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Видалення..." : "Видалити"}
            </Button>
          </>
        }
      >
        <p>
          Ви впевнені, що хочете видалити запис{" "}
          <strong className="text-slate-100">{entry.title}</strong>?
        </p>
      </Modal>
    </>
  );
}
