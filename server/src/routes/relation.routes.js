import { Router } from "express";
import * as relationController from "../controllers/relation.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireProjectRole } from "../middleware/projectRole.middleware.js";

const router = Router({ mergeParams: true });

router.use(requireAuth);

// Спеціальні роути — ДО /:relationId
router.get("/graph", requireProjectRole("VIEWER"), relationController.graph);
router.get("/types", requireProjectRole("VIEWER"), relationController.types);

// CRUD
router.get("/", requireProjectRole("VIEWER"), relationController.list);
router.post("/", requireProjectRole("AUTHOR"), relationController.create);
router.get(
  "/:relationId",
  requireProjectRole("VIEWER"),
  relationController.getOne,
);
router.put(
  "/:relationId",
  requireProjectRole("AUTHOR"),
  relationController.update,
);
router.delete(
  "/:relationId",
  requireProjectRole("EDITOR"),
  relationController.remove,
);

export default router;
