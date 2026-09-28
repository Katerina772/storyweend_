import { Router } from "express";
import * as projectController from "../controllers/project.controller.js";
import * as memberController from "../controllers/projectMember.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireProjectRole } from "../middleware/projectRole.middleware.js";
import characterRoutes from "./character.routes.js";
import locationRoutes from "./location.routes.js";
import factionRoutes from "./faction.routes.js";
import eventRoutes from "./event.routes.js";
import loreRoutes from "./lore.routes.js";
import relationRoutes from "./relation.routes.js";

const router = Router();

// Усі роути проєктів потребують автентифікації
router.use(requireAuth);

// Проєкти
router.post("/", projectController.create);
router.get("/mine", projectController.listMine);
router.get("/shared", projectController.listShared);
router.get("/:id", projectController.getOne);
router.put("/:id", requireProjectRole("EDITOR"), projectController.update);
router.delete("/:id", requireProjectRole("OWNER"), projectController.remove);

// Учасники
router.get(
  "/:projectId/members",
  requireProjectRole("VIEWER"),
  memberController.list,
);
router.post(
  "/:projectId/members",
  requireProjectRole("OWNER"),
  memberController.add,
);
router.put(
  "/:projectId/members/:memberId",
  requireProjectRole("OWNER"),
  memberController.updateRole,
);
router.delete(
  "/:projectId/members/:memberId",
  requireProjectRole("OWNER"),
  memberController.remove,
);

// Персонажі всередині проєкту
router.use("/:projectId/characters", characterRoutes);
router.use("/:projectId/locations", locationRoutes);
router.use("/:projectId/factions", factionRoutes);
router.use("/:projectId/events", eventRoutes);
router.use("/:projectId/lore", loreRoutes);
router.use("/:projectId/relations", relationRoutes);

export default router;
