export const RELATION_TYPES = {
  FRIEND: { label: "Дружба", color: "#22c55e", emoji: "🤝" },
  ENEMY: { label: "Ворожнеча", color: "#ef4444", emoji: "⚔️" },
  FAMILY: { label: "Спорідненість", color: "#eab308", emoji: "👪" },
  ALLY: { label: "Союз", color: "#3b82f6", emoji: "🛡️" },
  RIVAL: { label: "Суперництво", color: "#f97316", emoji: "🔥" },
  MENTOR: { label: "Наставництво", color: "#a855f7", emoji: "📚" },
  ROMANTIC: { label: "Романтика", color: "#ec4899", emoji: "❤️" },
  OTHER: { label: "Інше", color: "#94a3b8", emoji: "🔗" },
};

export const RELATION_TYPES_LIST = Object.keys(RELATION_TYPES);

export function getRelationInfo(type) {
  return RELATION_TYPES[type] || RELATION_TYPES.OTHER;
}
