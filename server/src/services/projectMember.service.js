import prisma from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import * as notificationService from "./notification.service.js";

const MEMBER_SELECT = {
  id: true,
  projectId: true,
  userId: true,
  role: true,
  joinedAt: true,
  user: {
    select: { id: true, username: true, email: true, avatar: true },
  },
};

export async function listMembers(projectId) {
  return prisma.projectMember.findMany({
    where: { projectId: BigInt(projectId) },
    orderBy: { joinedAt: "asc" },
    select: MEMBER_SELECT,
  });
}

// export async function addMemberByEmail(projectId, email, role) {
//   const user = await prisma.user.findUnique({ where: { email } });
//   if (!user) throw new ApiError(404, "User with this email not found");

//   const existing = await prisma.projectMember.findUnique({
//     where: {
//       projectId_userId: {
//         projectId: BigInt(projectId),
//         userId: user.id,
//       },
//     },
//   });
//   if (existing)
//     throw new ApiError(409, "User is already a member of this project");

//   return prisma.projectMember.create({
//     data: {
//       projectId: BigInt(projectId),
//       userId: user.id,
//       role,
//     },
//     select: MEMBER_SELECT,
//   });

//   // отримуємо проєкт для тексту сповіщення
//   const project = await prisma.project.findUnique({
//     where: { id: BigInt(projectId) },
//     select: { id: true, name: true },
//   });

//   await notificationService.create({
//     userId: user.id.toString(),
//     type: "PROJECT_MEMBER_ADDED",
//     title: "Вас додано до проєкту",
//     message: `Вас додано до проєкту "${project.name}" з роллю ${role}`,
//     link: `/projects/${project.id}/members`,
//     metadata: { projectId: project.id.toString(), role },
//   });
// }

export async function addMemberByEmail(projectId, email, role) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(404, "User with this email not found");

  const existing = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId: BigInt(projectId),
        userId: user.id,
      },
    },
  });
  if (existing)
    throw new ApiError(409, "User is already a member of this project");

  const member = await prisma.projectMember.create({
    data: {
      projectId: BigInt(projectId),
      userId: user.id,
      role,
    },
    select: MEMBER_SELECT,
  });

  const project = await prisma.project.findUnique({
    where: { id: BigInt(projectId) },
    select: { id: true, name: true },
  });

  await notificationService.create({
    userId: user.id.toString(),
    type: "PROJECT_MEMBER_ADDED",
    title: "Вас додано до проєкту",
    message: `Вас додано до проєкту "${project.name}" з роллю ${role}`,
    link: `/projects/${project.id}/members`,
    metadata: { projectId: project.id.toString(), role },
  });

  return member;
}

// export async function updateMemberRole(projectId, memberId, role) {
//   const member = await prisma.projectMember.findFirst({
//     where: { id: BigInt(memberId), projectId: BigInt(projectId) },
//   });
//   if (!member) throw new ApiError(404, "Member not found in this project");

//   return prisma.projectMember.update({
//     where: { id: member.id },
//     data: { role },
//     select: MEMBER_SELECT,
//   });
// }

export async function updateMemberRole(projectId, memberId, role) {
  const member = await prisma.projectMember.findFirst({
    where: { id: BigInt(memberId), projectId: BigInt(projectId) },
  });
  if (!member) throw new ApiError(404, "Member not found in this project");

  // Забороняємо знімати роль OWNER із власника проєкту
  if (member.role === "OWNER" && role !== "OWNER") {
    throw new ApiError(
      400,
      "Cannot change the owner's role. Transfer ownership first.",
    );
  }

  const oldRole = member.role;
  if (oldRole === role) {
    return prisma.projectMember.update({
      where: { id: member.id },
      data: { role },
      select: MEMBER_SELECT,
    });
  }

  const updated = await prisma.projectMember.update({
    where: { id: member.id },
    data: { role },
    select: MEMBER_SELECT,
  });

  const project = await prisma.project.findUnique({
    where: { id: BigInt(projectId) },
    select: { id: true, name: true },
  });

  await notificationService.create({
    userId: member.userId.toString(),
    type: "PROJECT_ROLE_CHANGED",
    title: "Вашу роль змінено",
    message: `У проєкті "${project.name}" вашу роль змінено з ${oldRole} на ${role}`,
    link: `/projects/${project.id}/members`,
    metadata: { projectId: project.id.toString(), oldRole, newRole: role },
  });

  return updated;
}

// export async function removeMember(projectId, memberId) {
//   const member = await prisma.projectMember.findFirst({
//     where: { id: BigInt(memberId), projectId: BigInt(projectId) },
//   });
//   if (!member) throw new ApiError(404, "Member not found in this project");

//   await prisma.projectMember.delete({ where: { id: member.id } });
//   return { success: true };
// }

export async function removeMember(projectId, memberId) {
  const member = await prisma.projectMember.findFirst({
    where: { id: BigInt(memberId), projectId: BigInt(projectId) },
  });
  if (!member) throw new ApiError(404, "Member not found in this project");

  // Забороняємо видаляти власника
  if (member.role === "OWNER") {
    throw new ApiError(400, "Cannot remove the project owner");
  }

  await prisma.projectMember.delete({ where: { id: member.id } });

  const project = await prisma.project.findUnique({
    where: { id: BigInt(projectId) },
    select: { id: true, name: true },
  });

  await notificationService.create({
    userId: member.userId.toString(),
    type: "PROJECT_MEMBER_REMOVED",
    title: "Вас видалено з проєкту",
    message: `Вас видалено з проєкту "${project.name}"`,
    metadata: { projectId: project.id.toString() },
  });

  return { success: true };
}
