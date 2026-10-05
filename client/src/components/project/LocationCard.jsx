import { Link, useParams } from "react-router-dom";
import { Badge } from "../ui/Badge.jsx";

export function LocationCard({ location }) {
  const { projectId } = useParams();

  return (
    <Link
      to={`/projects/${projectId}/locations/${location.id}`}
      className="block"
    >
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-slate-600 transition h-full flex flex-col">
        <div className="aspect-video bg-slate-900 flex items-center justify-center overflow-hidden">
          {location.image ? (
            <img
              src={location.image}
              alt={location.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-4xl text-slate-700">🗺️</span>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-lg font-semibold text-slate-100 mb-1 line-clamp-1">
            {location.name}
          </h3>

          {location.type && (
            <p className="text-xs text-slate-400 mb-2">{location.type}</p>
          )}

          <p className="text-sm text-slate-400 mb-3 line-clamp-2 flex-1">
            {location.description || "Без опису"}
          </p>

          <div className="flex items-center justify-between">
            {location.population != null && (
              <span className="text-xs text-slate-500">
                👥 {location.population.toLocaleString("uk-UA")}
              </span>
            )}
            {location.parent && (
              <Badge color="gray">↳ {location.parent.name}</Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
