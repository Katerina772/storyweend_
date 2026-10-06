import { Link, useParams } from "react-router-dom";
import { Badge } from "../ui/Badge.jsx";

export function FactionCard({ faction }) {
  const { projectId } = useParams();

  return (
    <Link
      to={`/projects/${projectId}/factions/${faction.id}`}
      className="block"
    >
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-slate-600 transition h-full flex flex-col">
        <div className="aspect-video bg-slate-900 flex items-center justify-center overflow-hidden">
          {faction.symbol ? (
            <img
              src={faction.symbol}
              alt={faction.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-4xl text-slate-700">🛡️</span>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-lg font-semibold text-slate-100 mb-1 line-clamp-1">
            {faction.name}
          </h3>

          <p className="text-sm text-slate-400 mb-3 line-clamp-2 flex-1">
            {faction.description || "Без опису"}
          </p>

          <div className="flex items-center justify-between text-xs">
            {faction.leader && (
              <span className="text-slate-500 line-clamp-1">
                👑 {faction.leader}
              </span>
            )}
            <Badge color="purple">
              {faction._count?.characterFactions ?? 0} учасн.
            </Badge>
          </div>
        </div>
      </div>
    </Link>
  );
}
