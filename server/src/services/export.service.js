import prisma from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Повний експорт проєкту в JSON.
 * Використовується для:
 *  - резервних копій
 *  - передачі даних у AI-модуль (РГР)
 *  - аналізу структури світу
 */
export async function exportProject(projectId, userId) {
  const pid = BigInt(projectId);

  const project = await prisma.project.findFirst({
    where: {
      id: pid,
      OR: [
        { ownerId: BigInt(userId) },
        { members: { some: { userId: BigInt(userId) } } },
      ],
    },
    select: {
      id: true,
      name: true,
      description: true,
      coverImage: true,
      mapImageUrl: true,
      createdAt: true,
      updatedAt: true,
      owner: {
        select: { id: true, username: true, email: true },
      },
      members: {
        select: {
          id: true,
          role: true,
          joinedAt: true,
          user: {
            select: { id: true, username: true, email: true },
          },
        },
      },
    },
  });

  if (!project) throw new ApiError(404, "Project not found or access denied");

  const [
    characters,
    characterRelations,
    locations,
    characterLocations,
    factions,
    characterFactions,
    events,
    eventCharacters,
    loreEntries,
    mapMarkers,
  ] = await Promise.all([
    prisma.character.findMany({
      where: { projectId: pid },
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
        portrait: true,
        description: true,
        biography: true,
        role: true,
        alignment: true,
        createdAt: true,
        updatedAt: true,
        author: { select: { id: true, username: true } },
      },
    }),

    prisma.characterRelation.findMany({
      where: { projectId: pid },
      orderBy: { id: "asc" },
      select: {
        id: true,
        characterFromId: true,
        characterToId: true,
        type: true,
        description: true,
      },
    }),

    prisma.location.findMany({
      where: { projectId: pid },
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
        type: true,
        population: true,
        image: true,
        description: true,
        history: true,
        parentId: true,
        createdAt: true,
        updatedAt: true,
        author: { select: { id: true, username: true } },
      },
    }),

    prisma.characterLocation.findMany({
      where: { character: { projectId: pid } },
      select: {
        id: true,
        characterId: true,
        locationId: true,
        type: true,
      },
    }),

    prisma.faction.findMany({
      where: { projectId: pid },
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
        symbol: true,
        description: true,
        history: true,
        leader: true,
        territory: true,
        createdAt: true,
        updatedAt: true,
      },
    }),

    prisma.characterFaction.findMany({
      where: { faction: { projectId: pid } },
      select: {
        id: true,
        characterId: true,
        factionId: true,
        role: true,
      },
    }),

    prisma.event.findMany({
      where: { projectId: pid },
      orderBy: [{ date: "asc" }, { id: "asc" }],
      select: {
        id: true,
        title: true,
        date: true,
        description: true,
        locationId: true,
        createdAt: true,
        updatedAt: true,
      },
    }),

    prisma.eventCharacter.findMany({
      where: { event: { projectId: pid } },
      select: {
        id: true,
        eventId: true,
        characterId: true,
        role: true,
      },
    }),

    prisma.loreEntry.findMany({
      where: { projectId: pid },
      orderBy: { id: "asc" },
      select: {
        id: true,
        title: true,
        category: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    }),

    prisma.mapMarker.findMany({
      where: { projectId: pid },
      select: {
        id: true,
        locationId: true,
        x: true,
        y: true,
      },
    }),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    formatVersion: "1.0",
    project,
    characters,
    characterRelations,
    locations,
    characterLocations,
    factions,
    characterFactions,
    events,
    eventCharacters,
    loreEntries,
    mapMarkers,
  };
}
