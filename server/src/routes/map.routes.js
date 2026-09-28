import { Router } from "express";
import * as mapController from "../controllers/map.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireProjectRole } from "../middleware/projectRole.middleware.js";

const router = Router({ mergeParams: true });

router.use(requireAuth);

// Карта
router.get("/", requireProjectRole("VIEWER"), mapController.getMap);
router.put("/image", requireProjectRole("EDITOR"), mapController.setMapImage);

// Маркери
router.post(
  "/markers",
  requireProjectRole("AUTHOR"),
  mapController.createMarker,
);
router.post(
  "/markers/with-location",
  requireProjectRole("AUTHOR"),
  mapController.createLocationWithMarker,
);
router.put(
  "/markers/:markerId",
  requireProjectRole("AUTHOR"),
  mapController.updateMarker,
);
router.delete(
  "/markers/:markerId",
  requireProjectRole("EDITOR"),
  mapController.deleteMarker,
);

export default router;
