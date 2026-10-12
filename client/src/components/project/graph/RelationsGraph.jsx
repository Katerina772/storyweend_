import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { CharacterNode } from "./CharacterNode.jsx";
import { RelationEdge } from "./RelationEdge.jsx";
import { getRelationInfo } from "../../../utils/relationTypes.js";

const nodeTypes = { character: CharacterNode };
const edgeTypes = { relation: RelationEdge };

/**
 * Розставляє вузли по колу.
 */
function layoutCircle(nodes) {
  const radius = Math.max(250, nodes.length * 40);
  const centerX = 500;
  const centerY = 400;
  const count = nodes.length;

  return nodes.map((node, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    return {
      ...node,
      position: {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      },
    };
  });
}

export function RelationsGraph({ graph, onEdgeClick }) {
  const initialNodes = useMemo(() => {
    const rawNodes = graph.nodes.map((c) => ({
      id: String(c.id),
      type: "character",
      data: {
        id: c.id,
        name: c.name,
        role: c.role,
        alignment: c.alignment,
        portrait: c.portrait,
      },
      position: { x: 0, y: 0 },
    }));
    return layoutCircle(rawNodes);
  }, [graph.nodes]);

  const initialEdges = useMemo(() => {
    return graph.edges.map((r) => {
      const info = getRelationInfo(r.type);
      return {
        id: String(r.id),
        source: String(r.from),
        target: String(r.to),
        type: "relation",
        data: { type: r.type, description: r.description, id: r.id },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: info.color,
        },
      };
    });
  }, [graph.edges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Оновлюємо при зміні вхідних даних
  useMemo(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const handleEdgeClick = useCallback(
    (_, edge) => {
      onEdgeClick?.(edge);
    },
    [onEdgeClick],
  );

  if (graph.nodes.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500">
        Немає персонажів для відображення.
      </div>
    );
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onEdgeClick={handleEdgeClick}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      proOptions={{ hideAttribution: true }}
      minZoom={0.2}
      maxZoom={2}
    >
      <Background color="#334155" gap={20} />
      <Controls className="!bg-slate-800 !border-slate-700" />
      <MiniMap
        className="!bg-slate-900 !border !border-slate-700"
        nodeColor={(n) => {
          const map = {
            POSITIVE: "#22c55e",
            NEGATIVE: "#ef4444",
            NEUTRAL: "#94a3b8",
          };
          return map[n.data?.alignment] || "#94a3b8";
        }}
      />
    </ReactFlow>
  );
}
