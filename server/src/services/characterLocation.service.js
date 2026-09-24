import prisma from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";

const LINK_SELECT = {
  id: true,
  characterId: true,
  locationId: true,
  type: true,
  character: { select: { id: true, name: true } },
  location: { select: { id: true, name: true, type: true } },
};

async function assertCharacterInProject(projectId, characterId) {
  const character = await prisma.character.findFirst({
    where: { id: BigInt(characterId), projectId: BigInt(projectId) },
  });
  if (!character)
    throw new ApiError(404, "Character not found in this project");
}

async function assertLocationInProject(projectId, locationId) {
  const location = await prisma.location.findFirst({
    where: { id: BigInt(locationId), projectId: BigInt(projectId) },
  });
  if (!location) throw new ApiError(404, "Location not found in this project");
}

export async function linkCharacterToLocation(projectId, data) {
  const { characterId, locationId, type } = data;

  await assertCharacterInProject(projectId, characterId);
  await assertLocationInProject(projectId, locationId);

  const existing = await prisma.characterLocation.findFirst({
    where: {
      characterId: BigInt(characterId),
      locationId: BigInt(locationId),
      type: type ?? null,
    },
  });
  if (existing) throw new ApiError(409, "This link already exists");

  return prisma.characterLocation.create({
    data: {
      characterId: BigInt(characterId),
      locationId: BigInt(locationId),
      type: type ?? null,
    },
    select: LINK_SELECT,
  });
}

export async function listLinksForCharacter(projectId, characterId) {
  await assertCharacterInProject(projectId, characterId);

  return prisma.characterLocation.findMany({
    where: { characterId: BigInt(characterId) },
    select: LINK_SELECT,
  });
}

export async function listLinksForLocation(projectId, locationId) {
  await assertLocationInProject(projectId, locationId);

  return prisma.characterLocation.findMany({
    where: { locationId: BigInt(locationId) },
    select: LINK_SELECT,
  });
}

export async function deleteLink(projectId, linkId) {
  const link = await prisma.characterLocation.findUnique({
    where: { id: BigInt(linkId) },
    include: { character: true, location: true },
  });

  if (!link) throw new ApiError(404, "Link not found");

  // Перевірка, що і персонаж, і локація належать проєкту
  if (
    link.character.projectId !== BigInt(projectId) ||
    link.location.projectId !== BigInt(projectId)
  ) {
    throw new ApiError(404, "Link not found in this project");
  }

  await prisma.characterLocation.delete({ where: { id: BigInt(linkId) } });
  return { success: true };
}
