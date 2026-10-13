import prisma from "../config/prisma.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
import { ApiError } from "../utils/ApiError.js";
import * as logService from "./activityLog.service.js";

export async function registerUser({ username, email, password }) {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existing) {
    throw new ApiError(409, "User with this email or username already exists");
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: { username, email, passwordHash },
    select: {
      id: true,
      username: true,
      email: true,
      avatar: true,
      bio: true,
      role: true,
      createdAt: true,
    },
  });

  await logService.log({
    userId: user.id.toString(),
    action: "USER_REGISTERED",
    entityType: "user",
    entityId: user.id.toString(),
  });

  const token = signToken({ userId: user.id.toString(), role: user.role });

  return { user, token };
}

export async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) {
    throw new ApiError(401, "Invalid credentials");
  }

  await logService.log({
    userId: user.id.toString(),
    action: "USER_LOGIN",
    entityType: "user",
    entityId: user.id.toString(),
  });

  const token = signToken({ userId: user.id.toString(), role: user.role });

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role,
      createdAt: user.createdAt,
    },
    token,
  };
}

export async function getCurrentUser(userId) {
  const user = await prisma.user.findUnique({
    where: { id: BigInt(userId) },
    select: {
      id: true,
      username: true,
      email: true,
      avatar: true,
      bio: true,
      role: true,
      createdAt: true,
    },
  });
  if (!user) throw new ApiError(404, "User not found");
  return user;
}

export async function updateCurrentUser(userId, data) {
  const updateData = {};

  if (data.username !== undefined) {
    const username = String(data.username).trim();
    if (username.length < 3) {
      throw new ApiError(400, "Username must be at least 3 characters");
    }
    if (username.length > 50) {
      throw new ApiError(400, "Username must be at most 50 characters");
    }
    // Перевірка унікальності
    const existing = await prisma.user.findFirst({
      where: {
        username,
        NOT: { id: BigInt(userId) },
      },
    });
    if (existing) {
      throw new ApiError(409, "Username is already taken");
    }
    updateData.username = username;
  }

  if (data.avatar !== undefined) {
    updateData.avatar = data.avatar ? String(data.avatar).trim() : null;
  }

  if (data.bio !== undefined) {
    updateData.bio = data.bio ? String(data.bio).trim() : null;
  }

  const user = await prisma.user.update({
    where: { id: BigInt(userId) },
    data: updateData,
    select: {
      id: true,
      username: true,
      email: true,
      avatar: true,
      bio: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
}
