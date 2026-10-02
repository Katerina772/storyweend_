import prisma from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";

// --- Огляд ---

export async function getOverview() {
  const [
    totalUsers,
    adminUsers,
    totalProjects,
    totalProjectMembers,
    totalCharacters,
    totalLocations,
    totalFactions,
    totalEvents,
    totalLoreEntries,
    totalLogs,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.project.count(),
    prisma.projectMember.count(),
    prisma.character.count(),
    prisma.location.count(),
    prisma.faction.count(),
    prisma.event.count(),
    prisma.loreEntry.count(),
    prisma.activityLog.count(),
  ]);

  return {
    users: {
      total: totalUsers,
      admins: adminUsers,
      regular: totalUsers - adminUsers,
    },
    projects: { total: totalProjects, members: totalProjectMembers },
    content: {
      characters: totalCharacters,
      locations: totalLocations,
      factions: totalFactions,
      events: totalEvents,
      loreEntries: totalLoreEntries,
    },
    activityLogs: totalLogs,
  };
}

// --- Користувачі ---

export async function listUsers(filters = {}) {
  const where = {};

  if (filters.role) where.role = filters.role;
  if (filters.search) {
    where.OR = [
      { username: { contains: filters.search, mode: "insensitive" } },
      { email: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: filters.limit ? Number(filters.limit) : 100,
    select: {
      id: true,
      username: true,
      email: true,
      avatar: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          ownedProjects: true,
          projectMembers: true,
        },
      },
    },
  });
}

export async function getUserById(userId) {
  const user = await prisma.user.findUnique({
    where: { id: BigInt(userId) },
    select: {
      id: true,
      username: true,
      email: true,
      avatar: true,
      bio: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          ownedProjects: true,
          projectMembers: true,
        },
      },
    },
  });
  if (!user) throw new ApiError(404, "User not found");
  return user;
}

export async function changeUserRole(userId, newRole, actingUserId) {
  if (!["USER", "ADMIN"].includes(newRole)) {
    throw new ApiError(400, "Invalid role");
  }

  const user = await prisma.user.findUnique({ where: { id: BigInt(userId) } });
  if (!user) throw new ApiError(404, "User not found");

  // Не дозволяємо адміну зняти роль із себе (щоб не втратити доступ)
  if (BigInt(actingUserId) === BigInt(userId) && newRole === "USER") {
    throw new ApiError(400, "You cannot remove your own admin role");
  }

  const oldRole = user.role;
  const updated = await prisma.user.update({
    where: { id: BigInt(userId) },
    data: { role: newRole },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
    },
  });

  return { user: updated, oldRole };
}

// --- Проєкти (тільки технічна інформація) ---

export async function listProjects(filters = {}) {
  const where = {};

  if (filters.search) {
    where.name = { contains: filters.search, mode: "insensitive" };
  }

  return prisma.project.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: filters.limit ? Number(filters.limit) : 100,
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      owner: {
        select: { id: true, username: true, email: true },
      },
      _count: {
        select: {
          members: true,
          characters: true,
          locations: true,
          factions: true,
          events: true,
          loreEntries: true,
        },
      },
    },
  });
}

export async function getProjectStats(projectId) {
  const project = await prisma.project.findUnique({
    where: { id: BigInt(projectId) },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      owner: {
        select: { id: true, username: true, email: true },
      },
      _count: {
        select: {
          members: true,
          characters: true,
          locations: true,
          factions: true,
          events: true,
          loreEntries: true,
          relations: true,
          mapMarkers: true,
        },
      },
    },
  });

  if (!project) throw new ApiError(404, "Project not found");
  return project;
}
