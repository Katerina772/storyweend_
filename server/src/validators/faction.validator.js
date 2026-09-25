import { ApiError } from "../utils/ApiError.js";

export function validateCreateFaction(body) {
  const { name } = body || {};

  if (!name || typeof name !== "string" || name.trim().length < 1) {
    throw new ApiError(400, "Faction name is required");
  }
  if (name.length > 100) {
    throw new ApiError(400, "Faction name must be at most 100 characters");
  }
}

export function validateUpdateFaction(body) {
  const { name } = body || {};

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length < 1) {
      throw new ApiError(400, "Faction name is required");
    }
    if (name.length > 100) {
      throw new ApiError(400, "Faction name must be at most 100 characters");
    }
  }
}
