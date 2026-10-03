import { Link } from "react-router-dom";
import { Badge } from "../ui/Badge.jsx";

export function ProjectCard({ project }) {
  const updated = new Date(project.updatedAt).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Link to={`/projects/${project.id}`} className="block">
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-slate-600 transition h-full flex flex-col">
        {/* Обкладинка */}
        <div className="aspect-video bg-slate-900 flex items-center justify-center overflow-hidden">
          {project.coverImage ? (
            <img
              src={project.coverImage}
              alt={project.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-4xl text-slate-700">🌍</span>
          )}
        </div>

        {/* Тіло */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-lg font-semibold text-slate-100 mb-1 line-clamp-1">
            {project.name}
          </h3>

          <p className="text-sm text-slate-400 mb-3 line-clamp-2 flex-1">
            {project.description || "Без опису"}
          </p>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Оновлено {updated}</span>
            <Badge color="blue">{project._count?.members || 1} учасн.</Badge>
          </div>
        </div>
      </div>
    </Link>
  );
}
