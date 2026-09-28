import { ApiError } from "../utils/ApiError.js";

export function validateCreateLore(body) {
  const { title } = body || {};

  if (!title || typeof title !== "string" || title.trim().length < 1) {
    throw new ApiError(400, "Lore title is required");
  }
  if (title.length > 150) {
    throw new ApiError(400, "Lore title must be at most 150 characters");
  }
}

export function validateUpdateLore(body) {
  const { title } = body || {};

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim().length < 1) {
      throw new ApiError(400, "Lore title is required");
    }
    if (title.length > 150) {
      throw new ApiError(400, "Lore title must be at most 150 characters");
    }
  }
}
