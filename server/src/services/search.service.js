import prisma from "../config/prisma.js";

/**
 * Глобальний пошук по всіх сутностях проєкту.
 * Повертає згруповані результати за типом.
 */
export async function searchInProject(projectId, query) {
  if (!query || query.trim().length < 2) {
    return {
      query: query ?? "",
      characters: [],
      locations: [],
      factions: [],
      events: [],
      loreEntries: [],
      total: 0,
    };
  }

  const q = query.trim();
  const pid = BigInt(projectId);
  const mode = "insensitive";

  const [characters, locations, factions, events, loreEntries] =
    await Promise.all([
      prisma.character.findMany({
        where: {
          projectId: pid,
          OR: [
            { name: { contains: q, mode } },
            { description: { contains: q, mode } },
            { biography: { contains: q, mode } },
            { role: { contains: q, mode } },
          ],
        },
        take: 10,
        select: {
          id: true,
          name: true,
          role: true,
          alignment: true,
          portrait: true,
          description: true,
        },
      }),

      prisma.location.findMany({
        where: {
          projectId: pid,
          OR: [
            { name: { contains: q, mode } },
            { description: { contains: q, mode } },
            { history: { contains: q, mode } },
            { type: { contains: q, mode } },
          ],
        },
        take: 10,
        select: {
          id: true,
          name: true,
          type: true,
          image: true,
          description: true,
        },
      }),

      prisma.faction.findMany({
        where: {
          projectId: pid,
          OR: [
            { name: { contains: q, mode } },
            { description: { contains: q, mode } },
            { history: { contains: q, mode } },
            { leader: { contains: q, mode } },
          ],
        },
        take: 10,
        select: {
          id: true,
          name: true,
          symbol: true,
          description: true,
          leader: true,
        },
      }),

      prisma.event.findMany({
        where: {
          projectId: pid,
          OR: [
            { title: { contains: q, mode } },
            { description: { contains: q, mode } },
            { date: { contains: q, mode } },
          ],
        },
        take: 10,
        orderBy: { date: "asc" },
        select: {
          id: true,
          title: true,
          date: true,
          description: true,
          location: { select: { id: true, name: true } },
        },
      }),

      prisma.loreEntry.findMany({
        where: {
          projectId: pid,
          OR: [
            { title: { contains: q, mode } },
            { content: { contains: q, mode } },
            { category: { contains: q, mode } },
          ],
        },
        take: 10,
        select: {
          id: true,
          title: true,
          category: true,
          content: true,
        },
      }),
    ]);

  const total =
    characters.length +
    locations.length +
    factions.length +
    events.length +
    loreEntries.length;

  return {
    query: q,
    characters,
    locations,
    factions,
    events,
    loreEntries,
    total,
  };
}
