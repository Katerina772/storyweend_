const TYPE_ICONS = {
  Країна: "🏛️",
  Регіон: "🗺️",
  Місто: "🏙️",
  Село: "🏘️",
  Замок: "🏰",
  Фортеця: "🏯",
  Ліс: "🌲",
  Гора: "⛰️",
  Острів: "🏝️",
  Руїни: "🏚️",
  Храм: "⛩️",
  Вежа: "🗼",
  Печера: "🕳️",
};

export function MapMarker({ marker, selected, onClick }) {
  const icon = TYPE_ICONS[marker.location?.type] || "📍";

  return (
    <button
      onClick={onClick}
      style={{
        left: `${marker.x}%`,
        top: `${marker.y}%`,
        transform: "translate(-50%, -100%)",
      }}
      className={`absolute transition ${
        selected ? "scale-125 z-20" : "z-10 hover:scale-110"
      }`}
      title={marker.location?.name}
    >
      <div
        className={`relative flex flex-col items-center ${
          selected ? "drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" : ""
        }`}
      >
        <div
          className={`px-2 py-1 rounded-full border-2 flex items-center gap-1 whitespace-nowrap text-xs font-medium ${
            selected
              ? "bg-purple-600 border-purple-300 text-white"
              : "bg-slate-800 border-slate-600 text-slate-200"
          }`}
        >
          <span>{icon}</span>
          <span>{marker.location?.name}</span>
        </div>
        <div
          className={`w-2 h-2 rotate-45 -mt-1 ${
            selected
              ? "bg-purple-600"
              : "bg-slate-800 border-r-2 border-b-2 border-slate-600"
          }`}
        />
      </div>
    </button>
  );
}
