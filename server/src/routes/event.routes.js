import { Router } from "express";
import * as eventController from "../controllers/event.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireProjectRole } from "../middleware/projectRole.middleware.js";

const router = Router({ mergeParams: true });

router.use(requireAuth);

// Події
router.get("/", requireProjectRole("VIEWER"), eventController.list);
router.post("/", requireProjectRole("AUTHOR"), eventController.create);

// Зв’язки (ДО /:eventId, інакше "links" сприйметься як eventId)
router.post(
  "/links",
  requireProjectRole("AUTHOR"),
  eventController.addCharacter,
);
router.put(
  "/links/:linkId",
  requireProjectRole("AUTHOR"),
  eventController.updateLink,
);
router.delete(
  "/links/:linkId",
  requireProjectRole("EDITOR"),
  eventController.deleteLink,
);

// Конкретна подія
router.get("/:eventId", requireProjectRole("VIEWER"), eventController.getOne);
router.put("/:eventId", requireProjectRole("AUTHOR"), eventController.update);
router.delete(
  "/:eventId",
  requireProjectRole("EDITOR"),
  eventController.remove,
);

// Персонажі події
router.get(
  "/:eventId/characters",
  requireProjectRole("VIEWER"),
  eventController.listCharactersForEvent,
);

export default router;
