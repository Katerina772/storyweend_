import prisma from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";

const EVENT_SELECT = {
  id: true,
  projectId: true,
  title: true,
  date: true,
  description: true,
  locationId: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: { id: true, username: true, avatar: true },
  },
  location: {
    select: { id: true, name: true, type: true },
  },
  _count: {
    select: { characters: true },
  },
};

async function assertLocationInProject(projectId, locationId) {
  const location = await prisma.location.findFirst({
    where: { id: BigInt(locationId), projectId: BigInt(projectId) },
  });
  if (!location) throw new ApiError(404, "Location not found in this project");
}

export async function createEvent(projectId, userId, data) {
  if (data.locationId !== undefined && data.locationId !== null) {
    await assertLocationInProject(projectId, data.locationId);
  }

  return prisma.event.create({
    data: {
      projectId: BigInt(projectId),
      createdBy: BigInt(userId),
      title: data.title,
      date: data.date ?? null,
      description: data.description ?? null,
      locationId: data.locationId != null ? BigInt(data.locationId) : null,
    },
    select: EVENT_SELECT,
  });
}

export async function listEvents(projectId, filters = {}) {
  const where = { projectId: BigInt(projectId) };

  if (filters.locationId) {
    where.locationId = BigInt(filters.locationId);
  }
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { date: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return prisma.event.findMany({
    where,
    orderBy: [{ date: "asc" }, { createdAt: "asc" }],
    select: EVENT_SELECT,
  });
}

export async function getEventById(projectId, eventId) {
  const event = await prisma.event.findFirst({
    where: {
      id: BigInt(eventId),
      projectId: BigInt(projectId),
    },
    select: EVENT_SELECT,
  });

  if (!event) throw new ApiError(404, "Event not found");
  return event;
}

export async function updateEvent(projectId, eventId, data) {
  await getEventById(projectId, eventId);

  if (data.locationId !== undefined && data.locationId !== null) {
    await assertLocationInProject(projectId, data.locationId);
  }

  return prisma.event.update({
    where: { id: BigInt(eventId) },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.date !== undefined && { date: data.date }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.locationId !== undefined && {
        locationId: data.locationId === null ? null : BigInt(data.locationId),
      }),
    },
    select: EVENT_SELECT,
  });
}

export async function deleteEvent(projectId, eventId) {
  await getEventById(projectId, eventId);
  await prisma.event.delete({ where: { id: BigInt(eventId) } });
  return { success: true };
}
