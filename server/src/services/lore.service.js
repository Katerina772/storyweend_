import prisma from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";

const LORE_SELECT = {
  id: true,
  projectId: true,
  title: true,
  category: true,
  content: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: { id: true, username: true, avatar: true },
  },
};

export async function createLore(projectId, userId, data) {
  return prisma.loreEntry.create({
    data: {
      projectId: BigInt(projectId),
      createdBy: BigInt(userId),
      title: data.title,
      category: data.category ?? null,
      content: data.content ?? null,
    },
    select: LORE_SELECT,
  });
}

export async function listLore(projectId, filters = {}) {
  const where = { projectId: BigInt(projectId) };

  if (filters.category) where.category = filters.category;
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { content: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return prisma.loreEntry.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    select: LORE_SELECT,
  });
}

export async function getLoreById(projectId, loreId) {
  const lore = await prisma.loreEntry.findFirst({
    where: {
      id: BigInt(loreId),
      projectId: BigInt(projectId),
    },
    select: LORE_SELECT,
  });

  if (!lore) throw new ApiError(404, "Lore entry not found");
  return lore;
}

export async function updateLore(projectId, loreId, data) {
  await getLoreById(projectId, loreId);

  return prisma.loreEntry.update({
    where: { id: BigInt(loreId) },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.content !== undefined && { content: data.content }),
    },
    select: LORE_SELECT,
  });
}

export async function deleteLore(projectId, loreId) {
  await getLoreById(projectId, loreId);
  await prisma.loreEntry.delete({ where: { id: BigInt(loreId) } });
  return { success: true };
}

/**
 * Повертає список унікальних категорій, які вже використані
 * в межах цього проєкту. Корисно для випадаючого списку в UI.
 */
export async function listCategories(projectId) {
  const rows = await prisma.loreEntry.findMany({
    where: { projectId: BigInt(projectId), category: { not: null } },
    distinct: ["category"],
    select: { category: true },
    orderBy: { category: "asc" },
  });
  return rows.map((r) => r.category).filter(Boolean);
}
