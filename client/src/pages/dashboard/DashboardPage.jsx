import { useEffect, useState, useCallback } from "react";
import { projectsApi } from "../../api/projects.api.js";
import { ProjectCard } from "../../components/project/ProjectCard.jsx";
import { CreateProjectModal } from "../../components/project/CreateProjectModal.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Loader } from "../../components/ui/Loader.jsx";
import { EmptyState } from "../../components/ui/EmptyState.jsx";

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { projects } = await projectsApi.listMine();
      setProjects(projects);
    } catch (err) {
      setError(err.response?.data?.error || "Не вдалося завантажити проєкти");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleCreated = (project) => {
    setProjects((prev) => [project, ...prev]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Мої проєкти</h1>
          <p className="text-sm text-slate-400 mt-1">
            Усі світи, які ви створили
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>+ Створити проєкт</Button>
      </div>

      {loading && <Loader />}

      {!loading && error && (
        <div className="px-3 py-2 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <EmptyState
          icon="🌍"
          title="У вас ще немає проєктів"
          description="Створіть свій перший вигаданий світ — додайте персонажів, локації, фракції та події."
          action={
            <Button onClick={() => setModalOpen(true)}>Створити проєкт</Button>
          }
        />
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      <CreateProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
