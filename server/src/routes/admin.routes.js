import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = Router();

router.use(requireAuth);
router.use(requireAdmin);

// Огляд
router.get("/overview", adminController.overview);

// Користувачі
router.get("/users", adminController.listUsers);
router.get("/users/:userId", adminController.getUser);
router.put("/users/:userId/role", adminController.changeRole);

// Проєкти
router.get("/projects", adminController.listProjects);
router.get("/projects/:projectId", adminController.getProject);

// Журнал дій
router.get("/logs", adminController.listLogs);

export default router;
