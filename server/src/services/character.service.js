import prisma from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";

const CHARACTER_SELECT = {
  id: true,
  projectId: true,
  name: true,
  portrait: true,
  description: true,
  biography: true,
  role: true,
  alignment: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: { id: true, username: true, avatar: true },
  },
};

export async function createCharacter(projectId, userId, data) {
  return prisma.character.create({
    data: {
      projectId: BigInt(projectId),
      createdBy: BigInt(userId),
      name: data.name,
      portrait: data.portrait ?? null,
      description: data.description ?? null,
      biography: data.biography ?? null,
      role: data.role ?? null,
      alignment: data.alignment ?? "NEUTRAL",
    },
    select: CHARACTER_SELECT,
  });
}

export async function listCharacters(projectId, filters = {}) {
  const where = { projectId: BigInt(projectId) };

  if (filters.alignment) where.alignment = filters.alignment;
  if (filters.role) where.role = filters.role;
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return prisma.character.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    select: CHARACTER_SELECT,
  });
}

export async function getCharacterById(projectId, characterId) {
  const character = await prisma.character.findFirst({
    where: {
      id: BigInt(characterId),
      projectId: BigInt(projectId),
    },
    select: CHARACTER_SELECT,
  });

  if (!character) throw new ApiError(404, "Character not found");
  return character;
}

export async function updateCharacter(projectId, characterId, data) {
  // Перевіряємо, що персонаж існує саме в цьому проєкті
  await getCharacterById(projectId, characterId);

  return prisma.character.update({
    where: { id: BigInt(characterId) },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.portrait !== undefined && { portrait: data.portrait }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.biography !== undefined && { biography: data.biography }),
      ...(data.role !== undefined && { role: data.role }),
      ...(data.alignment !== undefined && { alignment: data.alignment }),
    },
    select: CHARACTER_SELECT,
  });
}

export async function deleteCharacter(projectId, characterId) {
  await getCharacterById(projectId, characterId);
  await prisma.character.delete({ where: { id: BigInt(characterId) } });
  return { success: true };
}
