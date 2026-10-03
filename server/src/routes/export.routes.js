import { Router } from "express";
import * as searchController from "../controllers/search.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireProjectRole } from "../middleware/projectRole.middleware.js";

const router = Router({ mergeParams: true });

router.use(requireAuth);

router.get("/", requireProjectRole("VIEWER"), searchController.exportProject);

export default router;
