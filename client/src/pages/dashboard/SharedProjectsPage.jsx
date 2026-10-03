import { useEffect, useState } from "react";
import { projectsApi } from "../../api/projects.api.js";
import { ProjectCard } from "../../components/project/ProjectCard.jsx";
import { Loader } from "../../components/ui/Loader.jsx";
import { EmptyState } from "../../components/ui/EmptyState.jsx";

export default function SharedProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    projectsApi
      .listShared()
      .then(({ projects }) => {
        if (!cancelled) setProjects(projects);
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err.response?.data?.error || "Не вдалося завантажити проєкти",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Спільні проєкти</h1>
        <p className="text-sm text-slate-400 mt-1">
          Проєкти, у яких ви берете участь як учасник
        </p>
      </div>

      {loading && <Loader />}

      {!loading && error && (
        <div className="px-3 py-2 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <EmptyState
          icon="🤝"
          title="Спільних проєктів немає"
          description="Коли вас запросять до чужого проєкту, він з'явиться тут."
        />
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
