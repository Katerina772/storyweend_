import prisma from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";

// Ієрархія ролей: OWNER > EDITOR > AUTHOR > VIEWER
const ROLE_LEVEL = {
  OWNER: 4,
  EDITOR: 3,
  AUTHOR: 2,
  VIEWER: 1,
};

/**
 * Перевіряє, що поточний користувач має доступ до проєкту
 * і його роль >= мінімальної необхідної.
 */
export function requireProjectRole(minRole) {
  return async (req, res, next) => {
    try {
      const projectId = req.params.projectId || req.params.id;
      if (!projectId) throw new ApiError(400, "Project id is required");

      const member = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId: BigInt(projectId),
            userId: BigInt(req.userId),
          },
        },
      });

      if (!member)
        throw new ApiError(403, "You do not have access to this project");

      if (ROLE_LEVEL[member.role] < ROLE_LEVEL[minRole]) {
        throw new ApiError(403, "Insufficient permissions");
      }

      req.projectMember = member;
      next();
    } catch (err) {
      next(err);
    }
  };
}
