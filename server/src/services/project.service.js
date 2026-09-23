import prisma from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";

const PROJECT_SELECT = {
  id: true,
  ownerId: true,
  name: true,
  description: true,
  coverImage: true,
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
  const project = await prisma.project.create({
    data: {
      ownerId: BigInt(userId),
      name: data.name,
      description: data.description ?? null,
      coverImage: data.coverImage ?? null,
    },
    select: PROJECT_SELECT,
  });

  // Автоматично додаємо власника як учасника з роллю OWNER
  await prisma.projectMember.create({
    data: {
      projectId: project.id,
      userId: BigInt(userId),
      role: "OWNER",
    },
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
