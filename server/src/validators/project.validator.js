import { ApiError } from "../utils/ApiError.js";

export function validateCreateProject(body) {
  const { name, description, coverImage } = body || {};

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    throw new ApiError(400, "Project name must be at least 2 characters");
  }
  if (name.length > 150) {
    throw new ApiError(400, "Project name must be at most 150 characters");
  }
  if (description && typeof description !== "string") {
    throw new ApiError(400, "Description must be a string");
  }
  if (coverImage && typeof coverImage !== "string") {
    throw new ApiError(400, "Cover image must be a string");
  }
}

export function validateUpdateProject(body) {
  const { name, description, coverImage } = body || {};

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length < 2) {
      throw new ApiError(400, "Project name must be at least 2 characters");
    }
    if (name.length > 150) {
      throw new ApiError(400, "Project name must be at most 150 characters");
    }
  }
  if (description !== undefined && typeof description !== "string") {
    throw new ApiError(400, "Description must be a string");
  }
  if (coverImage !== undefined && typeof coverImage !== "string") {
    throw new ApiError(400, "Cover image must be a string");
  }
}
