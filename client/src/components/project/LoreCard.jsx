import { Badge } from "../ui/Badge.jsx";

export function LoreCard({ entry, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-slate-800 border border-slate-700 rounded-lg p-5 hover:border-slate-600 transition h-full flex flex-col"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-lg font-semibold text-slate-100 line-clamp-2">
          {entry.title}
        </h3>
        {entry.category && (
          <Badge color="purple" className="shrink-0">
            {entry.category}
          </Badge>
        )}
      </div>

      <p className="text-sm text-slate-400 line-clamp-4 flex-1">
        {entry.content || "Без вмісту"}
      </p>

      <div className="text-xs text-slate-500 mt-3">
        Оновлено {new Date(entry.updatedAt).toLocaleDateString("uk-UA")}
      </div>
    </button>
  );
}
