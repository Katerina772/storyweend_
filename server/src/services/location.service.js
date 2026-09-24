import prisma from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";

const LOCATION_SELECT = {
  id: true,
  projectId: true,
  parentId: true,
  name: true,
  type: true,
  population: true,
  image: true,
  description: true,
  history: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: { id: true, username: true, avatar: true },
  },
  parent: {
    select: { id: true, name: true, type: true },
  },
  _count: {
    select: {
      characterLocations: true,
      children: true,
    },
  },
};

export async function createLocation(projectId, userId, data) {
  // Якщо вказано parentId — перевіряємо, що батько існує в тому ж проєкті
  if (data.parentId !== undefined && data.parentId !== null) {
    await getLocationById(projectId, data.parentId);
  }

  return prisma.location.create({
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
    select: LOCATION_SELECT,
  });
}

export async function listLocations(projectId, filters = {}) {
  const where = { projectId: BigInt(projectId) };

  if (filters.type) where.type = filters.type;
  if (filters.parentId !== undefined) {
    where.parentId =
      filters.parentId === null ? null : BigInt(filters.parentId);
  }
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return prisma.location.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    select: LOCATION_SELECT,
  });
}

export async function getLocationById(projectId, locationId) {
  const location = await prisma.location.findFirst({
    where: {
      id: BigInt(locationId),
      projectId: BigInt(projectId),
    },
    select: LOCATION_SELECT,
  });

  if (!location) throw new ApiError(404, "Location not found");
  return location;
}

export async function updateLocation(projectId, locationId, data) {
  await getLocationById(projectId, locationId);

  if (data.parentId !== undefined && data.parentId !== null) {
    if (BigInt(data.parentId) === BigInt(locationId)) {
      throw new ApiError(400, "Location cannot be its own parent");
    }
    // Батько має існувати в тому ж проєкті
    await getLocationById(projectId, data.parentId);
  }

  return prisma.location.update({
    where: { id: BigInt(locationId) },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.type !== undefined && { type: data.type }),
      ...(data.population !== undefined && { population: data.population }),
      ...(data.image !== undefined && { image: data.image }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.history !== undefined && { history: data.history }),
      ...(data.parentId !== undefined && {
        parentId: data.parentId === null ? null : BigInt(data.parentId),
      }),
    },
    select: LOCATION_SELECT,
  });
}

export async function deleteLocation(projectId, locationId) {
  await getLocationById(projectId, locationId);
  // Дочірні локації не видаляються (onDelete: SetNull),
  // але якщо хочемо каскад — можна обробити тут окремо.
  await prisma.location.delete({ where: { id: BigInt(locationId) } });
  return { success: true };
}

export async function listChildLocations(projectId, parentId) {
  // Перевіряємо, що батько існує в проєкті
  await getLocationById(projectId, parentId);

  return prisma.location.findMany({
    where: {
      projectId: BigInt(projectId),
      parentId: BigInt(parentId),
    },
    orderBy: { name: "asc" },
    select: LOCATION_SELECT,
  });
}
