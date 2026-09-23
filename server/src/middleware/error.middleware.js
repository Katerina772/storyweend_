import { ApiError } from "../utils/ApiError.js";

export function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      error: err.message,
      details: err.details,
    });
  }

  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
}
