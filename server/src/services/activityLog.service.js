import prisma from "../config/prisma.js";

/**
 * Записує дію в журнал. Не кидає помилку, якщо запис не вдався —
 * логування не повинно ламати основний флоу.
 */
export async function log({
  userId,
  action,
  entityType,
  entityId,
  metadata,
  ipAddress,
}) {
  try {
    await prisma.activityLog.create({
      data: {
        userId: userId ? BigInt(userId) : null,
        action,
        entityType: entityType ?? null,
        entityId: entityId ? BigInt(entityId) : null,
        metadata: metadata ?? null,
        ipAddress: ipAddress ?? null,
      },
    });
  } catch (err) {
    console.error("Failed to write activity log:", err.message);
  }
}

export async function listLogs(filters = {}) {
  const where = {};

  if (filters.userId) where.userId = BigInt(filters.userId);
  if (filters.action) where.action = filters.action;

  return prisma.activityLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: filters.limit ? Number(filters.limit) : 100,
    select: {
      id: true,
      userId: true,
      action: true,
      entityType: true,
      entityId: true,
      metadata: true,
      ipAddress: true,
      createdAt: true,
      user: {
        select: { id: true, username: true, email: true },
      },
    },
  });
}
