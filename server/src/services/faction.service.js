import prisma from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";

const FACTION_SELECT = {
  id: true,
  projectId: true,
  name: true,
  symbol: true,
  description: true,
  history: true,
  leader: true,
  territory: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: { id: true, username: true, avatar: true },
  },
  _count: {
    select: { characterFactions: true },
  },
};

export async function createFaction(projectId, userId, data) {
  return prisma.faction.create({
    data: {
      projectId: BigInt(projectId),
      createdBy: BigInt(userId),
      name: data.name,
      symbol: data.symbol ?? null,
      description: data.description ?? null,
      history: data.history ?? null,
      leader: data.leader ?? null,
      territory: data.territory ?? null,
    },
    select: FACTION_SELECT,
  });
}

export async function listFactions(projectId, filters = {}) {
  const where = { projectId: BigInt(projectId) };

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return prisma.faction.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    select: FACTION_SELECT,
  });
}

export async function getFactionById(projectId, factionId) {
  const faction = await prisma.faction.findFirst({
    where: {
      id: BigInt(factionId),
      projectId: BigInt(projectId),
    },
    select: FACTION_SELECT,
  });

  if (!faction) throw new ApiError(404, "Faction not found");
  return faction;
}

export async function updateFaction(projectId, factionId, data) {
  await getFactionById(projectId, factionId);

  return prisma.faction.update({
    where: { id: BigInt(factionId) },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.symbol !== undefined && { symbol: data.symbol }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.history !== undefined && { history: data.history }),
      ...(data.leader !== undefined && { leader: data.leader }),
      ...(data.territory !== undefined && { territory: data.territory }),
    },
    select: FACTION_SELECT,
  });
}

export async function deleteFaction(projectId, factionId) {
  await getFactionById(projectId, factionId);
  await prisma.faction.delete({ where: { id: BigInt(factionId) } });
  return { success: true };
}
