import { BaseEdge, EdgeLabelRenderer, getBezierPath } from "@xyflow/react";
import { getRelationInfo } from "../../../utils/relationTypes.js";

export function RelationEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const info = getRelationInfo(data.type);

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: info.color,
          strokeWidth: selected ? 3 : 2,
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}
          className="px-2 py-0.5 rounded bg-slate-900 border text-xs font-medium nodrag nopan"
        >
          <span style={{ color: info.color }}>
            {info.emoji} {info.label}
          </span>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
