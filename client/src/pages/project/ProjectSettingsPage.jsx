import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjectContext } from "../../hooks/useProjectContext.js";
import { usePermissions } from "../../hooks/usePermissions.js";
import { projectsApi } from "../../api/projects.api.js";
import { Button } from "../../components/ui/Button.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Textarea } from "../../components/ui/Textarea.jsx";
import { DeleteProjectModal } from "../../components/project/DeleteProjectModal.jsx";

export default function ProjectSettingsPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const project = useProjectContext();
  const { canEditProject, canDeleteProject } = usePermissions();

  const [form, setForm] = useState({
    name: "",
    description: "",
    coverImage: "",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name || "",
        description: project.description || "",
        coverImage: project.coverImage || "",
      });
    }
  }, [project]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setSuccess("");
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Назва обов’язкова");
      return;
    }

    setSaving(true);
    setSuccess("");
    setError("");
    try {
      await projectsApi.update(projectId, {
        name: form.name.trim(),
        description: form.description.trim() || null,
        coverImage: form.coverImage.trim() || null,
      });
      setSuccess(
        "Збережено! Оновіть сторінку, щоб побачити зміни у заголовку.",
      );
    } catch (err) {
      setError(err.response?.data?.error || "Не вдалося зберегти");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await projectsApi.remove(projectId);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Не вдалося видалити проєкт");
    }
  };

  if (!canEditProject && !canDeleteProject) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-100 mb-4">Налаштування</h1>
        <p className="text-slate-400">
          У вас немає прав для зміни налаштувань цього проєкту.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">Налаштування</h1>

      {canEditProject && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">
            Основна інформація
          </h2>

          {success && (
            <div className="mb-4 px-3 py-2 rounded bg-green-500/10 border border-green-500/30 text-green-300 text-sm">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-4 px-3 py-2 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <Input
              label="Назва проєкту *"
              value={form.name}
              onChange={handleChange("name")}
              maxLength={150}
            />

            <Textarea
              label="Опис"
              value={form.description}
              onChange={handleChange("description")}
              rows={4}
            />

            <Input
              label="Обкладинка (URL)"
              placeholder="https://..."
              value={form.coverImage}
              onChange={handleChange("coverImage")}
            />

            {form.coverImage && (
              <div>
                <p className="text-sm text-slate-400 mb-2">
                  Попередній перегляд:
                </p>
                <div className="aspect-video w-48 bg-slate-950 border border-slate-700 rounded-lg overflow-hidden">
                  <img
                    src={form.coverImage}
                    alt="Обкладинка"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? "Збереження..." : "Зберегти"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {canDeleteProject && (
        <div className="bg-red-500/5 border border-red-500/30 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-300 mb-2">
            Небезпечна зона
          </h2>
          <p className="text-sm text-slate-400 mb-4">
            Видалення проєкту — незворотна дія. Усі дані буде втрачено.
          </p>
          <Button variant="danger" onClick={() => setDeleteOpen(true)}>
            Видалити проєкт
          </Button>
        </div>
      )}

      <DeleteProjectModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        projectName={project.name}
        onConfirm={handleDelete}
      />
    </div>
  );
}
