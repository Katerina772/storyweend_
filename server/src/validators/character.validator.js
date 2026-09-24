import { ApiError } from "../utils/ApiError.js";

const ALIGNMENTS = ["POSITIVE", "NEGATIVE", "NEUTRAL"];

export function validateCreateCharacter(body) {
  const { name, alignment } = body || {};

  if (!name || typeof name !== "string" || name.trim().length < 1) {
    throw new ApiError(400, "Character name is required");
  }
  if (name.length > 100) {
    throw new ApiError(400, "Character name must be at most 100 characters");
  }
  if (alignment && !ALIGNMENTS.includes(alignment)) {
    throw new ApiError(400, "Invalid alignment");
  }
}

export function validateUpdateCharacter(body) {
  const { name, alignment } = body || {};

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length < 1) {
      throw new ApiError(400, "Character name is required");
    }
    if (name.length > 100) {
      throw new ApiError(400, "Character name must be at most 100 characters");
    }
  }
  if (alignment !== undefined && !ALIGNMENTS.includes(alignment)) {
    throw new ApiError(400, "Invalid alignment");
  }
}
