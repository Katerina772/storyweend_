const COLORS = {
  blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  green: "bg-green-500/20 text-green-300 border-green-500/30",
  red: "bg-red-500/20 text-red-300 border-red-500/30",
  yellow: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  gray: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

export function Badge({ children, color = "gray", className = "" }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${COLORS[color]} ${className}`}
    >
      {children}
    </span>
  );
}
