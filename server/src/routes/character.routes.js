import { Router } from "express";
import * as characterController from "../controllers/character.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireProjectRole } from "../middleware/projectRole.middleware.js";
import * as locationController from "../controllers/location.controller.js";
import * as factionController from "../controllers/faction.controller.js";
import * as eventController from "../controllers/event.controller.js";

const router = Router({ mergeParams: true });

router.use(requireAuth);

// Перегляд — будь-який учасник проєкту
router.get("/", requireProjectRole("VIEWER"), characterController.list);
router.get(
  "/:characterId",
  requireProjectRole("VIEWER"),
  characterController.getOne,
);

// Створення та редагування — AUTHOR і вище
router.post("/", requireProjectRole("AUTHOR"), characterController.create);
router.put(
  "/:characterId",
  requireProjectRole("AUTHOR"),
  characterController.update,
);

// Видалення — EDITOR і вище
router.delete(
  "/:characterId",
  requireProjectRole("EDITOR"),
  characterController.remove,
);

// Локації конкретного персонажа
router.get(
  "/:characterId/locations",
  requireProjectRole("VIEWER"),
  locationController.listLinksForCharacter,
);

// Фракції конкретного персонажа
router.get(
  "/:characterId/factions",
  requireProjectRole("VIEWER"),
  factionController.listFactionsForCharacter,
);

// Події конкретного персонажа
router.get(
  "/:characterId/events",
  requireProjectRole("VIEWER"),
  eventController.listEventsForCharacter,
);

export default router;
