import { ApiError } from "../utils/ApiError.js";

export function validateCreateLocation(body) {
  const { name, population } = body || {};

  if (!name || typeof name !== "string" || name.trim().length < 1) {
    throw new ApiError(400, "Location name is required");
  }
  if (name.length > 100) {
    throw new ApiError(400, "Location name must be at most 100 characters");
  }
  if (population !== undefined && population !== null) {
    if (!Number.isInteger(population) || population < 0) {
      throw new ApiError(400, "Population must be a non-negative integer");
    }
  }
}

export function validateUpdateLocation(body) {
  const { name, population } = body || {};

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length < 1) {
      throw new ApiError(400, "Location name is required");
    }
    if (name.length > 100) {
      throw new ApiError(400, "Location name must be at most 100 characters");
    }
  }
  if (population !== undefined && population !== null) {
    if (!Number.isInteger(population) || population < 0) {
      throw new ApiError(400, "Population must be a non-negative integer");
    }
  }
}
