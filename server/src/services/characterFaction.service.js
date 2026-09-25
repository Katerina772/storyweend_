import prisma from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";

const LINK_SELECT = {
  id: true,
  characterId: true,
  factionId: true,
  role: true,
  character: { select: { id: true, name: true } },
  faction: { select: { id: true, name: true } },
};

async function assertCharacterInProject(projectId, characterId) {
  const character = await prisma.character.findFirst({
    where: { id: BigInt(characterId), projectId: BigInt(projectId) },
  });
  if (!character)
    throw new ApiError(404, "Character not found in this project");
}

async function assertFactionInProject(projectId, factionId) {
  const faction = await prisma.faction.findFirst({
    where: { id: BigInt(factionId), projectId: BigInt(projectId) },
  });
  if (!faction) throw new ApiError(404, "Faction not found in this project");
}

export async function addCharacterToFaction(projectId, data) {
  const { characterId, factionId, role } = data;

  await assertCharacterInProject(projectId, characterId);
  await assertFactionInProject(projectId, factionId);

  const existing = await prisma.characterFaction.findUnique({
    where: {
      characterId_factionId: {
        characterId: BigInt(characterId),
        factionId: BigInt(factionId),
      },
    },
  });
  if (existing) {
    throw new ApiError(409, "Character is already a member of this faction");
  }

  return prisma.characterFaction.create({
    data: {
      characterId: BigInt(characterId),
      factionId: BigInt(factionId),
      role: role ?? null,
    },
    select: LINK_SELECT,
  });
}

export async function listFactionsForCharacter(projectId, characterId) {
  await assertCharacterInProject(projectId, characterId);

  return prisma.characterFaction.findMany({
    where: { characterId: BigInt(characterId) },
    select: LINK_SELECT,
  });
}

export async function listCharactersForFaction(projectId, factionId) {
  await assertFactionInProject(projectId, factionId);

  return prisma.characterFaction.findMany({
    where: { factionId: BigInt(factionId) },
    select: LINK_SELECT,
  });
}

export async function updateLinkRole(projectId, linkId, role) {
  const link = await prisma.characterFaction.findUnique({
    where: { id: BigInt(linkId) },
    include: { faction: true },
  });
  if (!link || link.faction.projectId !== BigInt(projectId)) {
    throw new ApiError(404, "Link not found in this project");
  }

  return prisma.characterFaction.update({
    where: { id: BigInt(linkId) },
    data: { role },
    select: LINK_SELECT,
  });
}

export async function deleteLink(projectId, linkId) {
  const link = await prisma.characterFaction.findUnique({
    where: { id: BigInt(linkId) },
    include: { faction: true },
  });
  if (!link || link.faction.projectId !== BigInt(projectId)) {
    throw new ApiError(404, "Link not found in this project");
  }

  await prisma.characterFaction.delete({ where: { id: BigInt(linkId) } });
  return { success: true };
}
