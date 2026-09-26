import prisma from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";

const LINK_SELECT = {
  id: true,
  eventId: true,
  characterId: true,
  role: true,
  event: { select: { id: true, title: true, date: true } },
  character: { select: { id: true, name: true } },
};

async function assertEventInProject(projectId, eventId) {
  const event = await prisma.event.findFirst({
    where: { id: BigInt(eventId), projectId: BigInt(projectId) },
  });
  if (!event) throw new ApiError(404, "Event not found in this project");
}

async function assertCharacterInProject(projectId, characterId) {
  const character = await prisma.character.findFirst({
    where: { id: BigInt(characterId), projectId: BigInt(projectId) },
  });
  if (!character)
    throw new ApiError(404, "Character not found in this project");
}

export async function addCharacterToEvent(projectId, data) {
  const { eventId, characterId, role } = data;

  await assertEventInProject(projectId, eventId);
  await assertCharacterInProject(projectId, characterId);

  const existing = await prisma.eventCharacter.findUnique({
    where: {
      eventId_characterId: {
        eventId: BigInt(eventId),
        characterId: BigInt(characterId),
      },
    },
  });
  if (existing) {
    throw new ApiError(409, "Character is already linked to this event");
  }

  return prisma.eventCharacter.create({
    data: {
      eventId: BigInt(eventId),
      characterId: BigInt(characterId),
      role: role ?? null,
    },
    select: LINK_SELECT,
  });
}

export async function listCharactersForEvent(projectId, eventId) {
  await assertEventInProject(projectId, eventId);

  return prisma.eventCharacter.findMany({
    where: { eventId: BigInt(eventId) },
    select: LINK_SELECT,
  });
}

export async function listEventsForCharacter(projectId, characterId) {
  await assertCharacterInProject(projectId, characterId);

  return prisma.eventCharacter.findMany({
    where: { characterId: BigInt(characterId) },
    orderBy: { event: { date: "asc" } },
    select: LINK_SELECT,
  });
}

export async function updateLinkRole(projectId, linkId, role) {
  const link = await prisma.eventCharacter.findUnique({
    where: { id: BigInt(linkId) },
    include: { event: true },
  });
  if (!link || link.event.projectId !== BigInt(projectId)) {
    throw new ApiError(404, "Link not found in this project");
  }

  return prisma.eventCharacter.update({
    where: { id: BigInt(linkId) },
    data: { role },
    select: LINK_SELECT,
  });
}

export async function deleteLink(projectId, linkId) {
  const link = await prisma.eventCharacter.findUnique({
    where: { id: BigInt(linkId) },
    include: { event: true },
  });
  if (!link || link.event.projectId !== BigInt(projectId)) {
    throw new ApiError(404, "Link not found in this project");
  }

  await prisma.eventCharacter.delete({ where: { id: BigInt(linkId) } });
  return { success: true };
}
