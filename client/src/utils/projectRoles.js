export const PROJECT_ROLES = {
  OWNER: {
    label: "Власник",
    color: "yellow",
    description: "Повний доступ, керування учасниками, видалення проєкту",
  },
  EDITOR: {
    label: "Редактор",
    color: "purple",
    description: "Створення, редагування та видалення контенту",
  },
  AUTHOR: {
    label: "Автор",
    color: "blue",
    description: "Створення та редагування контенту",
  },
  VIEWER: {
    label: "Переглядач",
    color: "gray",
    description: "Тільки перегляд",
  },
};

export const ASSIGNABLE_ROLES = ["EDITOR", "AUTHOR", "VIEWER"];

export function getRoleInfo(role) {
  return PROJECT_ROLES[role] || PROJECT_ROLES.VIEWER;
}
