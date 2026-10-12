import { useState, useEffect } from "react";
import { Modal } from "../ui/Modal.jsx";
import { Input } from "../ui/Input.jsx";
import { Button } from "../ui/Button.jsx";
import { mapApi } from "../../api/map.api.js";
import { useParams } from "react-router-dom";

export function MapImageModal({ open, onClose, currentImageUrl, onUpdated }) {
  const { projectId } = useParams();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setUrl(currentImageUrl || "");
      setError("");
    }
  }, [open, currentImageUrl]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const { project } = await mapApi.setMapImage(
        projectId,
        url.trim() || null,
      );
      onUpdated?.(project.mapImageUrl);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Не вдалося оновити карту");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Зображення карти"
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
      {error && (
        <div className="mb-4 px-3 py-2 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      <Input
        label="URL зображення"
        placeholder="https://example.com/map.jpg"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <p className="text-xs text-slate-500 mt-2">
        Вставте посилання на зображення вашої карти. Порожнє поле прибирає
        карту.
      </p>
    </Modal>
  );
}
