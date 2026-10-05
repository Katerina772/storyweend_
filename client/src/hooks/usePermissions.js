import { useProjectContext } from "./useProjectContext.js";

/**
 * Повертає прапорці прав для поточного користувача в проєкті.
 * Ієрархія ролей: OWNER > EDITOR > AUTHOR > VIEWER.
 */
export function usePermissions() {
  const project = useProjectContext();
  const role = project.currentUserRole;

  const isOwner = role === "OWNER";
  const isEditor = isOwner || role === "EDITOR";
  const isAuthor = isEditor || role === "AUTHOR";
  const isViewer = !!role;

  return {
    role,

    // Хто що може
    canView: isViewer,
    canCreate: isAuthor, // створювати контент
    canEdit: isAuthor, // редагувати контент
    canDelete: isEditor, // видаляти контент
    canEditProject: isEditor, // редагувати сам проєкт
    canDeleteProject: isOwner, // видаляти проєкт
    canManageMembers: isOwner, // керувати учасниками
  };
}
