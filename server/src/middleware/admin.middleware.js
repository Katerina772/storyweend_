import { ApiError } from "../utils/ApiError.js";

/**
 * Пропускає тільки користувачів із системною роллю ADMIN.
 * Використовується ПІСЛЯ requireAuth.
 */
export function requireAdmin(req, res, next) {
  if (req.userRole !== "ADMIN") {
    return next(new ApiError(403, "Admin access required"));
  }
  next();
}
