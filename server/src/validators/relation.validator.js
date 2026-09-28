import { ApiError } from "../utils/ApiError.js";

const RELATION_TYPES = [
  "FRIEND",
  "ENEMY",
  "FAMILY",
  "ALLY",
  "RIVAL",
  "MENTOR",
  "ROMANTIC",
  "OTHER",
];

export function validateCreateRelation(body) {
  const { characterFromId, characterToId, type } = body || {};

  if (!characterFromId || !characterToId) {
    throw new ApiError(400, "characterFromId and characterToId are required");
  }
  if (String(characterFromId) === String(characterToId)) {
    throw new ApiError(400, "A character cannot be related to itself");
  }
  if (!type || !RELATION_TYPES.includes(type)) {
    throw new ApiError(400, "Invalid relation type");
  }
}

export function validateUpdateRelation(body) {
  const { type } = body || {};

  if (type !== undefined && !RELATION_TYPES.includes(type)) {
    throw new ApiError(400, "Invalid relation type");
  }
}

export const RELATION_TYPES_LIST = RELATION_TYPES;
