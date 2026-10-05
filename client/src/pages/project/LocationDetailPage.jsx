import { useParams } from "react-router-dom";

export default function LocationDetailPage() {
  const { locationId } = useParams();
  return <div className="text-slate-100">Локація #{locationId} (заглушка)</div>;
}
