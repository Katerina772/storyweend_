import prisma from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";

const NOTIFICATION_SELECT = {
  id: true,
  userId: true,
  type: true,
  title: true,
  message: true,
  link: true,
  metadata: true,
  readAt: true,
  createdAt: true,
};

/**
 * Створює сповіщення. Не кидає помилку, якщо не вдалося —
 * сповіщення не повинно ламати основний флоу.
 */
export async function create({ userId, type, title, message, link, metadata }) {
  try {
    return await prisma.notification.create({
      data: {
        userId: BigInt(userId),
        type,
        title,
        message: message ?? null,
        link: link ?? null,
        metadata: metadata ?? null,
      },
      select: NOTIFICATION_SELECT,
    });
  } catch (err) {
    console.error("Failed to create notification:", err.message);
    return null;
  }
}

/**
 * Масове створення (наприклад, усім учасникам проєкту).
 */
export async function createMany(items) {
  const created = [];
  for (const item of items) {
    const n = await create(item);
    if (n) created.push(n);
  }
  return created;
}

export async function listForUser(userId, filters = {}) {
  const where = { userId: BigInt(userId) };

  if (filters.unread === "true") {
    where.readAt = null;
  }
  if (filters.type) {
    where.type = filters.type;
  }

  return prisma.notification.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: filters.limit ? Number(filters.limit) : 50,
    select: NOTIFICATION_SELECT,
  });
}

export async function getUnreadCount(userId) {
  return prisma.notification.count({
    where: { userId: BigInt(userId), readAt: null },
  });
}

export async function markAsRead(userId, notificationId) {
  const notification = await prisma.notification.findFirst({
    where: { id: BigInt(notificationId), userId: BigInt(userId) },
  });
  if (!notification) throw new ApiError(404, "Notification not found");

  if (notification.readAt) {
    // Уже прочитане — повертаємо як є
    return notification;
  }

  return prisma.notification.update({
    where: { id: notification.id },
    data: { readAt: new Date() },
    select: NOTIFICATION_SELECT,
  });
}

export async function markAllAsRead(userId) {
  const result = await prisma.notification.updateMany({
    where: { userId: BigInt(userId), readAt: null },
    data: { readAt: new Date() },
  });
  return { count: result.count };
}

export async function deleteNotification(userId, notificationId) {
  const notification = await prisma.notification.findFirst({
    where: { id: BigInt(notificationId), userId: BigInt(userId) },
  });
  if (!notification) throw new ApiError(404, "Notification not found");

  await prisma.notification.delete({ where: { id: notification.id } });
  return { success: true };
}

/**
 * Видаляє всі прочитані сповіщення користувача.
 */
export async function deleteAllRead(userId) {
  const result = await prisma.notification.deleteMany({
    where: { userId: BigInt(userId), readAt: { not: null } },
  });
  return { count: result.count };
}
