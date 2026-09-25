import { Router } from "express";
import * as factionController from "../controllers/faction.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireProjectRole } from "../middleware/projectRole.middleware.js";

const router = Router({ mergeParams: true });

router.use(requireAuth);

// Фракції
router.get("/", requireProjectRole("VIEWER"), factionController.list);
router.post("/", requireProjectRole("AUTHOR"), factionController.create);

// Зв’язки (мають бути ДО /:factionId)
router.post(
  "/links",
  requireProjectRole("AUTHOR"),
  factionController.addCharacter,
);
router.put(
  "/links/:linkId",
  requireProjectRole("AUTHOR"),
  factionController.updateLink,
);
router.delete(
  "/links/:linkId",
  requireProjectRole("EDITOR"),
  factionController.deleteLink,
);

// Конкретна фракція
router.get(
  "/:factionId",
  requireProjectRole("VIEWER"),
  factionController.getOne,
);
router.put(
  "/:factionId",
  requireProjectRole("AUTHOR"),
  factionController.update,
);
router.delete(
  "/:factionId",
  requireProjectRole("EDITOR"),
  factionController.remove,
);

// Персонажі фракції
router.get(
  "/:factionId/characters",
  requireProjectRole("VIEWER"),
  factionController.listCharactersForFaction,
);

export default router;
