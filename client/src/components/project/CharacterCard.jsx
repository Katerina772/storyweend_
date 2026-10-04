import { Link, useParams } from "react-router-dom";
import { Badge } from "../ui/Badge.jsx";

const ALIGNMENT_MAP = {
  POSITIVE: { label: "Позитивний", color: "green" },
  NEGATIVE: { label: "Негативний", color: "red" },
  NEUTRAL: { label: "Нейтральний", color: "gray" },
};

export function CharacterCard({ character }) {
  const { projectId } = useParams();
  const align = ALIGNMENT_MAP[character.alignment] || ALIGNMENT_MAP.NEUTRAL;

  return (
    <Link
      to={`/projects/${projectId}/characters/${character.id}`}
      className="block"
    >
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-slate-600 transition h-full flex flex-col">
        <div className="aspect-square bg-slate-900 flex items-center justify-center overflow-hidden">
          {character.portrait ? (
            <img
              src={character.portrait}
              alt={character.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-5xl text-slate-700">👤</span>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-lg font-semibold text-slate-100 mb-1 line-clamp-1">
            {character.name}
          </h3>

          {character.role && (
            <p className="text-xs text-slate-400 mb-2">{character.role}</p>
          )}

          <p className="text-sm text-slate-400 mb-3 line-clamp-2 flex-1">
            {character.description || "Без опису"}
          </p>

          <div className="flex justify-end">
            <Badge color={align.color}>{align.label}</Badge>
          </div>
        </div>
      </div>
    </Link>
  );
}
