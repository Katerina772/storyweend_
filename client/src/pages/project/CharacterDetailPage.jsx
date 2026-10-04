import { useParams } from "react-router-dom";

export default function CharacterDetailPage() {
  const { characterId } = useParams();
  return (
    <div className="text-slate-100">Персонаж #{characterId} (заглушка)</div>
  );
}
