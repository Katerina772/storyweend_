import { Handle, Position } from "@xyflow/react";
import { Link } from "react-router-dom";

export function CharacterNode({ data }) {
  const alignColors = {
    POSITIVE: "border-green-500",
    NEGATIVE: "border-red-500",
    NEUTRAL: "border-slate-500",
  };

  return (
    <div
      className={`bg-slate-800 border-2 rounded-lg shadow-lg min-w-[140px] ${
        alignColors[data.alignment] || alignColors.NEUTRAL
      }`}
    >
      <Handle type="target" position={Position.Top} />

      <div className="p-3 text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden mb-2">
          {data.portrait ? (
            <img
              src={data.portrait}
              alt={data.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xl text-slate-700">👤</span>
          )}
        </div>

        <div className="text-sm font-semibold text-slate-100 line-clamp-1">
          {data.name}
        </div>

        {data.role && (
          <div className="text-xs text-slate-400 line-clamp-1 mt-1">
            {data.role}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
