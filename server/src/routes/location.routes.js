import { Router } from "express";
import * as locationController from "../controllers/location.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireProjectRole } from "../middleware/projectRole.middleware.js";

const router = Router({ mergeParams: true });

router.use(requireAuth);

// Локації
router.get("/", requireProjectRole("VIEWER"), locationController.list);
router.post("/", requireProjectRole("AUTHOR"), locationController.create);

// Зв’язки (мають бути ДО /:locationId, інакше "links" сприйметься як locationId)
router.post(
  "/links",
  requireProjectRole("AUTHOR"),
  locationController.linkCharacter,
);
router.delete(
  "/links/:linkId",
  requireProjectRole("EDITOR"),
  locationController.deleteLink,
);

// Конкретна локація
router.get(
  "/:locationId",
  requireProjectRole("VIEWER"),
  locationController.getOne,
);
router.put(
  "/:locationId",
  requireProjectRole("AUTHOR"),
  locationController.update,
);
router.delete(
  "/:locationId",
  requireProjectRole("EDITOR"),
  locationController.remove,
);

// Дочірні локації та персонажі локації
router.get(
  "/:locationId/children",
  requireProjectRole("VIEWER"),
  locationController.listChildren,
);
router.get(
  "/:locationId/characters",
  requireProjectRole("VIEWER"),
  locationController.listLinksForLocation,
);

export default router;
