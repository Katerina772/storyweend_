import { Router } from "express";
import * as loreController from "../controllers/lore.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireProjectRole } from "../middleware/projectRole.middleware.js";

const router = Router({ mergeParams: true });

router.use(requireAuth);

// Спеціальні роути — ДО /:loreId
router.get(
  "/categories",
  requireProjectRole("VIEWER"),
  loreController.categories,
);

// CRUD
router.get("/", requireProjectRole("VIEWER"), loreController.list);
router.post("/", requireProjectRole("AUTHOR"), loreController.create);
router.get("/:loreId", requireProjectRole("VIEWER"), loreController.getOne);
router.put("/:loreId", requireProjectRole("AUTHOR"), loreController.update);
router.delete("/:loreId", requireProjectRole("EDITOR"), loreController.remove);

export default router;
