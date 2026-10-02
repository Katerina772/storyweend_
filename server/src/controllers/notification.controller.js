import * as notificationService from "../services/notification.service.js";

export async function list(req, res, next) {
  try {
    const notifications = await notificationService.listForUser(req.userId, {
      unread: req.query.unread,
      type: req.query.type,
      limit: req.query.limit,
    });
    res.json({ notifications });
  } catch (err) {
    next(err);
  }
}

export async function unreadCount(req, res, next) {
  try {
    const count = await notificationService.getUnreadCount(req.userId);
    res.json({ count });
  } catch (err) {
    next(err);
  }
}

export async function markAsRead(req, res, next) {
  try {
    const notification = await notificationService.markAsRead(
      req.userId,
      req.params.notificationId,
    );
    res.json({ notification });
  } catch (err) {
    next(err);
  }
}

export async function markAllAsRead(req, res, next) {
  try {
    const result = await notificationService.markAllAsRead(req.userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const result = await notificationService.deleteNotification(
      req.userId,
      req.params.notificationId,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function clearRead(req, res, next) {
  try {
    const result = await notificationService.deleteAllRead(req.userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
