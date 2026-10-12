import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useProjectContext } from "../../hooks/useProjectContext.js";
import { usePermissions } from "../../hooks/usePermissions.js";
import { relationsApi } from "../../api/relations.api.js";
import { charactersApi } from "../../api/characters.api.js";
import { RelationsGraph } from "../../components/project/graph/RelationsGraph.jsx";
import { RelationModal } from "../../components/project/graph/RelationModal.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Loader } from "../../components/ui/Loader.jsx";
import { EmptyState } from "../../components/ui/EmptyState.jsx";

export default function RelationsPage() {
  const { projectId } = useParams();
  const project = useProjectContext();
  const { canCreate } = usePermissions();

  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRelation, setEditingRelation] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [{ nodes, edges }, { characters }] = await Promise.all([
        relationsApi.graph(projectId),
        charactersApi.list(projectId, {}),
      ]);
      setGraph({ nodes, edges });
      setCharacters(characters);
    } catch (err) {
      setError(err.response?.data?.error || "Не вдалося завантажити граф");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = () => {
    setEditingRelation(null);
    setModalOpen(true);
  };

  const handleEdgeClick = (edge) => {
    // edge.data.id — id зв'язку
    const relation = {
      id: edge.data.id,
      characterFromId: edge.source,
      characterToId: edge.target,
      type: edge.data.type,
      description: edge.data.description,
    };
    setEditingRelation(relation);
    setModalOpen(true);
  };

  const handleRefresh = () => load();

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="px-3 py-2 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Зв’язки</h1>
          <p className="text-sm text-slate-400 mt-1">
            {graph.edges.length} зв’язків між {graph.nodes.length} персонажами
          </p>
        </div>
        {canCreate && (
          <Button onClick={handleCreate}>+ Створити зв’язок</Button>
        )}
      </div>

      {graph.nodes.length === 0 ? (
        <EmptyState
          icon="🕸️"
          title="Немає персонажів для графа"
          description="Створіть хоча б двох персонажів, щоб побачити граф взаємозв’язків."
        />
      ) : (
        <div className="flex-1 min-h-[600px] bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <RelationsGraph graph={graph} onEdgeClick={handleEdgeClick} />
        </div>
      )}

      <div className="text-xs text-slate-500 mt-3 text-center">
        💡 Клікніть на ребро (лінію), щоб редагувати або видалити зв’язок.
        Перетягуйте вузли для перестановки.
      </div>

      <RelationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        characters={characters}
        editingRelation={editingRelation}
        onCreated={handleRefresh}
        onUpdated={handleRefresh}
        onDeleted={handleRefresh}
      />
    </div>
  );
}
