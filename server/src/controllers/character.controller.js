import * as characterService from "../services/character.service.js";
import {
  validateCreateCharacter,
  validateUpdateCharacter,
} from "../validators/character.validator.js";

export async function create(req, res, next) {
  try {
    validateCreateCharacter(req.body);
    const character = await characterService.createCharacter(
      req.params.projectId,
      req.userId,
      req.body,
    );
    res.status(201).json({ character });
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    const filters = {
      alignment: req.query.alignment,
      role: req.query.role,
      search: req.query.search,
    };
    const characters = await characterService.listCharacters(
      req.params.projectId,
      filters,
    );
    res.json({ characters });
  } catch (err) {
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    const character = await characterService.getCharacterById(
      req.params.projectId,
      req.params.characterId,
    );
    res.json({ character });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    validateUpdateCharacter(req.body);
    const character = await characterService.updateCharacter(
      req.params.projectId,
      req.params.characterId,
      req.body,
    );
    res.json({ character });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const result = await characterService.deleteCharacter(
      req.params.projectId,
      req.params.characterId,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}
