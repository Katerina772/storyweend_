import { verifyToken } from "../utils/jwt.js";
import { ApiError } from "../utils/ApiError.js";

export function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new ApiError(401, "Missing or invalid Authorization header");
    }

    const payload = verifyToken(token);
    req.userId = payload.userId;
    req.userRole = payload.role;

    next();
  } catch (err) {
    if (err instanceof ApiError) return next(err);
    next(new ApiError(401, "Invalid or expired token"));
  }
}
