// import { useEffect, useState, useCallback } from "react";
// import { useParams } from "react-router-dom";
// import { useProjectContext } from "../../hooks/useProjectContext.js";
// import { charactersApi } from "../../api/characters.api.js";
// import { CharacterCard } from "../../components/project/CharacterCard.jsx";
// import { CreateCharacterModal } from "../../components/project/CreateCharacterModal.jsx";
// import { Button } from "../../components/ui/Button.jsx";
// import { Input } from "../../components/ui/Input.jsx";
// import { Loader } from "../../components/ui/Loader.jsx";
// import { EmptyState } from "../../components/ui/EmptyState.jsx";
// import { usePermissions } from "../../hooks/usePermissions.js";

// const ALIGNMENTS = [
//   { value: "", label: "Усі категорії" },
//   { value: "POSITIVE", label: "Позитивні" },
//   { value: "NEGATIVE", label: "Негативні" },
//   { value: "NEUTRAL", label: "Нейтральні" },
// ];

// export default function CharactersPage() {
//   const { projectId } = useParams();
//   const project = useProjectContext();
//   const { canCreate } = usePermissions();

//   const [characters, setCharacters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [modalOpen, setModalOpen] = useState(false);

//   const [search, setSearch] = useState("");
//   const [alignment, setAlignment] = useState("");

//   const loadCharacters = useCallback(async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const filters = {};
//       if (search.trim()) filters.search = search.trim();
//       if (alignment) filters.alignment = alignment;

//       const { characters } = await charactersApi.list(projectId, filters);
//       setCharacters(characters);
//     } catch (err) {
//       setError(
//         err.response?.data?.error || "Не вдалося завантажити персонажів",
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [projectId, search, alignment]);

//   useEffect(() => {
//     const timer = setTimeout(loadCharacters, 300);
//     return () => clearTimeout(timer);
//   }, [loadCharacters]);

//   const handleCreated = (character) => {
//     setCharacters((prev) => [character, ...prev]);
//   };

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-100">Персонажі</h1>
//           <p className="text-sm text-slate-400 mt-1">
//             {characters.length} у проєкті «{project.name}»
//           </p>
//         </div>
//         <Button onClick={() => setModalOpen(true)}>+ Створити персонажа</Button>
//       </div>

//       {/* Фільтри */}
//       <div className="flex flex-wrap gap-3 mb-6">
//         <Input
//           placeholder="Пошук за ім'ям або описом..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="max-w-sm"
//         />
//         <select
//           value={alignment}
//           onChange={(e) => setAlignment(e.target.value)}
//           className="bg-slate-800 border border-slate-700 text-slate-100 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
//         >
//           {ALIGNMENTS.map((a) => (
//             <option key={a.value} value={a.value}>
//               {a.label}
//             </option>
//           ))}
//         </select>
//       </div>

//       {loading && <Loader />}

//       {!loading && error && (
//         <div className="px-3 py-2 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
//           {error}
//         </div>
//       )}

//       {!loading && !error && characters.length === 0 && (
//         <EmptyState
//           icon="👤"
//           title={
//             search || alignment ? "Нічого не знайдено" : "Ще немає персонажів"
//           }
//           description={
//             search || alignment
//               ? "Спробуйте змінити фільтри."
//               : "Створіть свого першого персонажа — героя, антагоніста або NPC."
//           }
//           action={
//             !search &&
//             !alignment &&
//             canCreate && (
//               <Button onClick={() => setModalOpen(true)}>
//                 Створити персонажа
//               </Button>
//             )
//           }
//         />
//       )}

//       {!loading && !error && characters.length > 0 && (
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//           {characters.map((c) => (
//             <CharacterCard key={c.id} character={c} />
//           ))}
//         </div>
//       )}

//       <CreateCharacterModal
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onCreated={handleCreated}
//       />
//     </div>
//   );
// }

import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useProjectContext } from "../../hooks/useProjectContext.js";
import { usePermissions } from "../../hooks/usePermissions.js";
import { charactersApi } from "../../api/characters.api.js";
import { CharacterCard } from "../../components/project/CharacterCard.jsx";
import { CreateCharacterModal } from "../../components/project/CreateCharacterModal.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Loader } from "../../components/ui/Loader.jsx";
import { EmptyState } from "../../components/ui/EmptyState.jsx";

const ALIGNMENTS = [
  { value: "", label: "Усі категорії" },
  { value: "POSITIVE", label: "Позитивні" },
  { value: "NEGATIVE", label: "Негативні" },
  { value: "NEUTRAL", label: "Нейтральні" },
];

export default function CharactersPage() {
  const { projectId } = useParams();
  const project = useProjectContext();
  const { canCreate } = usePermissions();

  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [alignment, setAlignment] = useState("");

  const loadCharacters = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const filters = {};
      if (search.trim()) filters.search = search.trim();
      if (alignment) filters.alignment = alignment;

      const { characters } = await charactersApi.list(projectId, filters);
      setCharacters(characters);
    } catch (err) {
      setError(
        err.response?.data?.error || "Не вдалося завантажити персонажів",
      );
    } finally {
      setLoading(false);
    }
  }, [projectId, search, alignment]);

  useEffect(() => {
    const timer = setTimeout(loadCharacters, 300);
    return () => clearTimeout(timer);
  }, [loadCharacters]);

  const handleCreated = (character) => {
    setCharacters((prev) => [character, ...prev]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Персонажі</h1>
          <p className="text-sm text-slate-400 mt-1">
            {characters.length} у проєкті «{project.name}»
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => setModalOpen(true)}>
            + Створити персонажа
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Input
          placeholder="Пошук за ім'ям або описом..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={alignment}
          onChange={(e) => setAlignment(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-100 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
        >
          {ALIGNMENTS.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
      </div>

      {loading && <Loader />}

      {!loading && error && (
        <div className="px-3 py-2 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && characters.length === 0 && (
        <EmptyState
          icon="👤"
          title={
            search || alignment ? "Нічого не знайдено" : "Ще немає персонажів"
          }
          description={
            search || alignment
              ? "Спробуйте змінити фільтри."
              : canCreate
                ? "Створіть свого першого персонажа — героя, антагоніста або NPC."
                : "Коли власник додасть персонажів, вони з'являться тут."
          }
          action={
            !search &&
            !alignment &&
            canCreate && (
              <Button onClick={() => setModalOpen(true)}>
                Створити персонажа
              </Button>
            )
          }
        />
      )}

      {!loading && !error && characters.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {characters.map((c) => (
            <CharacterCard key={c.id} character={c} />
          ))}
        </div>
      )}

      <CreateCharacterModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
