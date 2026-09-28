import { ApiError } from "../utils/ApiError.js";

function isCoordinate(value) {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 100
  );
}

export function validateCreateMarker(body) {
  const { locationId, x, y } = body || {};

  if (!locationId) {
    throw new ApiError(400, "locationId is required");
  }
  if (!isCoordinate(x) || !isCoordinate(y)) {
    throw new ApiError(400, "x and y must be numbers between 0 and 100");
  }
}

export function validateUpdateMarker(body) {
  const { x, y } = body || {};

  if (x !== undefined && !isCoordinate(x)) {
    throw new ApiError(400, "x must be a number between 0 and 100");
  }
  if (y !== undefined && !isCoordinate(y)) {
    throw new ApiError(400, "y must be a number between 0 and 100");
  }
}

export function validateCreateLocationWithMarker(body) {
  const { name, x, y } = body || {};

  if (!name || typeof name !== "string" || name.trim().length < 1) {
    throw new ApiError(400, "Location name is required");
  }
  if (name.length > 100) {
    throw new ApiError(400, "Location name must be at most 100 characters");
  }
  if (!isCoordinate(x) || !isCoordinate(y)) {
    throw new ApiError(400, "x and y must be numbers between 0 and 100");
  }
}

export function validateMapImage(body) {
  const { mapImageUrl } = body || {};

  if (mapImageUrl !== null && mapImageUrl !== undefined) {
    if (typeof mapImageUrl !== "string" || mapImageUrl.length > 500) {
      throw new ApiError(
        400,
        "mapImageUrl must be a string (max 500 chars) or null",
      );
    }
  }
}
