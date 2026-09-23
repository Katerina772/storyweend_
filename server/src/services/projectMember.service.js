import prisma from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";

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

  return prisma.projectMember.create({
    data: {
      projectId: BigInt(projectId),
      userId: user.id,
      role,
    },
    select: MEMBER_SELECT,
  });
}

export async function updateMemberRole(projectId, memberId, role) {
  const member = await prisma.projectMember.findFirst({
    where: { id: BigInt(memberId), projectId: BigInt(projectId) },
  });
  if (!member) throw new ApiError(404, "Member not found in this project");

  return prisma.projectMember.update({
    where: { id: member.id },
    data: { role },
    select: MEMBER_SELECT,
  });
}

export async function removeMember(projectId, memberId) {
  const member = await prisma.projectMember.findFirst({
    where: { id: BigInt(memberId), projectId: BigInt(projectId) },
  });
  if (!member) throw new ApiError(404, "Member not found in this project");

  await prisma.projectMember.delete({ where: { id: member.id } });
  return { success: true };
}
