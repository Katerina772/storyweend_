import prisma from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import * as logService from "./activityLog.service.js";

const PROJECT_SELECT = {
  id: true,
  ownerId: true,
  name: true,
  description: true,
  coverImage: true,
  mapImageUrl: true,
  createdAt: true,
  updatedAt: true,
  owner: {
    select: { id: true, username: true, avatar: true },
  },
  _count: {
    select: { members: true },
  },
};

export async function createProject(userId, data) {
  const project = await prisma.$transaction(async (tx) => {
    const created = await tx.project.create({
      data: {
        ownerId: BigInt(userId),
        name: data.name,
        description: data.description ?? null,
        coverImage: data.coverImage ?? null,
      },
      select: PROJECT_SELECT,
    });

    await tx.projectMember.create({
      data: {
        projectId: created.id,
        userId: BigInt(userId),
        role: "OWNER",
      },
    });

    return created;
  });

  await logService.log({
    userId: userId.toString(),
    action: "PROJECT_CREATED",
    entityType: "project",
    entityId: project.id.toString(),
  });

  return project;
}

export async function listMyProjects(userId) {
  return prisma.project.findMany({
    where: { ownerId: BigInt(userId) },
    orderBy: { updatedAt: "desc" },
    select: PROJECT_SELECT,
  });
}

export async function listSharedProjects(userId) {
  return prisma.project.findMany({
    where: {
      ownerId: { not: BigInt(userId) },
      members: { some: { userId: BigInt(userId) } },
    },
    orderBy: { updatedAt: "desc" },
    select: PROJECT_SELECT,
  });
}

export async function getProjectById(projectId, userId) {
  const project = await prisma.project.findFirst({
    where: {
      id: BigInt(projectId),
      OR: [
        { ownerId: BigInt(userId) },
        { members: { some: { userId: BigInt(userId) } } },
      ],
    },
    select: PROJECT_SELECT,
  });

  if (!project) throw new ApiError(404, "Project not found or access denied");
  return project;
}

export async function updateProject(projectId, data) {
  return prisma.project.update({
    where: { id: BigInt(projectId) },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.coverImage !== undefined && { coverImage: data.coverImage }),
    },
    select: PROJECT_SELECT,
  });
}

export async function deleteProject(projectId) {
  await prisma.project.delete({ where: { id: BigInt(projectId) } });
  return { success: true };
}

export async function getProjectOverview(projectId) {
  const pid = BigInt(projectId);

  const [
    characters,
    locations,
    factions,
    events,
    loreEntries,
    members,
    relations,
    mapMarkers,
  ] = await Promise.all([
    prisma.character.count({ where: { projectId: pid } }),
    prisma.location.count({ where: { projectId: pid } }),
    prisma.faction.count({ where: { projectId: pid } }),
    prisma.event.count({ where: { projectId: pid } }),
    prisma.loreEntry.count({ where: { projectId: pid } }),
    prisma.projectMember.count({ where: { projectId: pid } }),
    prisma.characterRelation.count({ where: { projectId: pid } }),
    prisma.mapMarker.count({ where: { projectId: pid } }),
  ]);

  return {
    counts: {
      characters,
      locations,
      factions,
      events,
      loreEntries,
      members,
      relations,
      mapMarkers,
    },
  };
}
