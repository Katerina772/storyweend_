export function Loader({ message = "Завантаження..." }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">{message}</p>
      </div>
    </div>
  );
}
