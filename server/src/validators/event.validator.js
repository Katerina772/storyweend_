import { ApiError } from "../utils/ApiError.js";

export function validateCreateEvent(body) {
  const { title } = body || {};

  if (!title || typeof title !== "string" || title.trim().length < 1) {
    throw new ApiError(400, "Event title is required");
  }
  if (title.length > 150) {
    throw new ApiError(400, "Event title must be at most 150 characters");
  }
}

export function validateUpdateEvent(body) {
  const { title } = body || {};

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim().length < 1) {
      throw new ApiError(400, "Event title is required");
    }
    if (title.length > 150) {
      throw new ApiError(400, "Event title must be at most 150 characters");
    }
  }
}
