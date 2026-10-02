import { Router } from "express";
import * as notificationController from "../controllers/notification.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);

// Спеціальні роути — ДО /:notificationId
router.get("/unread-count", notificationController.unreadCount);
router.put("/read-all", notificationController.markAllAsRead);
router.delete("/read", notificationController.clearRead);

// Основні
router.get("/", notificationController.list);
router.put("/:notificationId/read", notificationController.markAsRead);
router.delete("/:notificationId", notificationController.remove);

export default router;
