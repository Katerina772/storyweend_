import prisma from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";

const RELATION_SELECT = {
  id: true,
  projectId: true,
  characterFromId: true,
  characterToId: true,
  type: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  characterFrom: { select: { id: true, name: true, portrait: true } },
  characterTo: { select: { id: true, name: true, portrait: true } },
};

async function assertCharacterInProject(projectId, characterId) {
  const character = await prisma.character.findFirst({
    where: { id: BigInt(characterId), projectId: BigInt(projectId) },
  });
  if (!character)
    throw new ApiError(404, "Character not found in this project");
}

export async function createRelation(projectId, data) {
  const { characterFromId, characterToId, type, description } = data;

  await assertCharacterInProject(projectId, characterFromId);
  await assertCharacterInProject(projectId, characterToId);

  const existing = await prisma.characterRelation.findUnique({
    where: {
      projectId_characterFromId_characterToId_type: {
        projectId: BigInt(projectId),
        characterFromId: BigInt(characterFromId),
        characterToId: BigInt(characterToId),
        type,
      },
    },
  });
  if (existing) {
    throw new ApiError(409, "This relation already exists");
  }

  return prisma.characterRelation.create({
    data: {
      projectId: BigInt(projectId),
      characterFromId: BigInt(characterFromId),
      characterToId: BigInt(characterToId),
      type,
      description: description ?? null,
    },
    select: RELATION_SELECT,
  });
}

export async function listRelations(projectId, filters = {}) {
  const where = { projectId: BigInt(projectId) };

  if (filters.type) where.type = filters.type;
  if (filters.characterId) {
    where.OR = [
      { characterFromId: BigInt(filters.characterId) },
      { characterToId: BigInt(filters.characterId) },
    ];
  }

  return prisma.characterRelation.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: RELATION_SELECT,
  });
}

export async function getRelationById(projectId, relationId) {
  const relation = await prisma.characterRelation.findFirst({
    where: {
      id: BigInt(relationId),
      projectId: BigInt(projectId),
    },
    select: RELATION_SELECT,
  });

  if (!relation) throw new ApiError(404, "Relation not found");
  return relation;
}

export async function updateRelation(projectId, relationId, data) {
  await getRelationById(projectId, relationId);

  return prisma.characterRelation.update({
    where: { id: BigInt(relationId) },
    data: {
      ...(data.type !== undefined && { type: data.type }),
      ...(data.description !== undefined && { description: data.description }),
    },
    select: RELATION_SELECT,
  });
}

export async function deleteRelation(projectId, relationId) {
  await getRelationById(projectId, relationId);
  await prisma.characterRelation.delete({ where: { id: BigInt(relationId) } });
  return { success: true };
}

/**
 * Повертає граф зв’язків для проєкту:
 *  - nodes — усі персонажі проєкту
 *  - edges — усі зв’язки між ними
 * Зручно для рендерингу у React Flow / vis-network.
 */
export async function getGraph(projectId) {
  const [characters, relations] = await Promise.all([
    prisma.character.findMany({
      where: { projectId: BigInt(projectId) },
      select: {
        id: true,
        name: true,
        portrait: true,
        role: true,
        alignment: true,
      },
    }),
    prisma.characterRelation.findMany({
      where: { projectId: BigInt(projectId) },
      select: {
        id: true,
        characterFromId: true,
        characterToId: true,
        type: true,
        description: true,
      },
    }),
  ]);

  return {
    nodes: characters,
    edges: relations.map((r) => ({
      id: r.id,
      from: r.characterFromId,
      to: r.characterToId,
      type: r.type,
      description: r.description,
    })),
  };
}
