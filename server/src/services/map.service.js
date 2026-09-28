import prisma from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";

const MARKER_SELECT = {
  id: true,
  projectId: true,
  locationId: true,
  x: true,
  y: true,
  createdAt: true,
  updatedAt: true,
  location: {
    select: {
      id: true,
      name: true,
      type: true,
      image: true,
      description: true,
      parentId: true,
    },
  },
};

async function assertLocationInProject(projectId, locationId) {
  const location = await prisma.location.findFirst({
    where: { id: BigInt(locationId), projectId: BigInt(projectId) },
  });
  if (!location) throw new ApiError(404, "Location not found in this project");
}

/**
 * Повертає всі маркери проєкту + URL зображення карти.
 */
export async function getMap(projectId) {
  const [project, markers] = await Promise.all([
    prisma.project.findUnique({
      where: { id: BigInt(projectId) },
      select: { id: true, name: true, mapImageUrl: true },
    }),
    prisma.mapMarker.findMany({
      where: { projectId: BigInt(projectId) },
      orderBy: { createdAt: "asc" },
      select: MARKER_SELECT,
    }),
  ]);

  if (!project) throw new ApiError(404, "Project not found");

  return {
    mapImageUrl: project.mapImageUrl,
    markers,
  };
}

/**
 * Додає маркер для вже існуючої локації.
 */
export async function createMarker(projectId, data) {
  await assertLocationInProject(projectId, data.locationId);

  const existing = await prisma.mapMarker.findUnique({
    where: { locationId: BigInt(data.locationId) },
  });
  if (existing) {
    throw new ApiError(409, "This location already has a marker on the map");
  }

  return prisma.mapMarker.create({
    data: {
      projectId: BigInt(projectId),
      locationId: BigInt(data.locationId),
      x: data.x,
      y: data.y,
    },
    select: MARKER_SELECT,
  });
}

/**
 * Створює локацію і одразу додає її на карту — одним запитом.
 * Використовується, коли користувач клікає на карту і створює нову локацію.
 */
export async function createLocationWithMarker(projectId, userId, data) {
  return prisma.$transaction(async (tx) => {
    const location = await tx.location.create({
      data: {
        projectId: BigInt(projectId),
        createdBy: BigInt(userId),
        name: data.name,
        type: data.type ?? null,
        population: data.population ?? null,
        image: data.image ?? null,
        description: data.description ?? null,
        history: data.history ?? null,
        parentId: data.parentId != null ? BigInt(data.parentId) : null,
      },
    });

    const marker = await tx.mapMarker.create({
      data: {
        projectId: BigInt(projectId),
        locationId: location.id,
        x: data.x,
        y: data.y,
      },
      select: MARKER_SELECT,
    });

    return marker;
  });
}

export async function updateMarker(projectId, markerId, data) {
  const marker = await prisma.mapMarker.findFirst({
    where: { id: BigInt(markerId), projectId: BigInt(projectId) },
  });
  if (!marker) throw new ApiError(404, "Marker not found");

  return prisma.mapMarker.update({
    where: { id: BigInt(markerId) },
    data: {
      ...(data.x !== undefined && { x: data.x }),
      ...(data.y !== undefined && { y: data.y }),
    },
    select: MARKER_SELECT,
  });
}

export async function deleteMarker(projectId, markerId) {
  const marker = await prisma.mapMarker.findFirst({
    where: { id: BigInt(markerId), projectId: BigInt(projectId) },
  });
  if (!marker) throw new ApiError(404, "Marker not found");

  await prisma.mapMarker.delete({ where: { id: BigInt(markerId) } });
  return { success: true };
}

export async function updateMapImage(projectId, mapImageUrl) {
  const project = await prisma.project.update({
    where: { id: BigInt(projectId) },
    data: { mapImageUrl },
    select: { id: true, name: true, mapImageUrl: true },
  });
  return project;
}
