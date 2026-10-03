import { useEffect, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import { projectsApi } from "../../api/projects.api.js";
import { ProjectSidebar } from "./ProjectSidebar.jsx";
import { Loader } from "../ui/Loader.jsx";
import { Badge } from "../ui/Badge.jsx";

export function ProjectLayout() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    projectsApi
      .getOne(projectId)
      .then(({ project }) => {
        if (!cancelled) setProject(project);
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err.response?.data?.error || "Не вдалося завантажити проєкт",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="px-4 py-3 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-sm mb-4">
            {error}
          </div>
          <Link
            to="/dashboard"
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            ← Повернутися до кабінету
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Верхня панель проєкту */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="text-slate-400 hover:text-slate-100 text-sm"
          >
            ← Кабінет
          </Link>
          <div className="h-5 w-px bg-slate-700" />
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-slate-100">
              {project.name}
            </h1>
            <Badge color="purple">Проєкт #{project.id}</Badge>
          </div>
        </div>
      </header>

      {/* Sidebar + Content */}
      <div className="flex flex-1">
        <ProjectSidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet context={{ project }} />
        </main>
      </div>
    </div>
  );
}
