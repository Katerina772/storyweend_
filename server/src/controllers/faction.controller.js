import * as factionService from "../services/faction.service.js";
import * as linkService from "../services/characterFaction.service.js";
import {
  validateCreateFaction,
  validateUpdateFaction,
} from "../validators/faction.validator.js";
import { ApiError } from "../utils/ApiError.js";

// --- Фракції ---

export async function create(req, res, next) {
  try {
    validateCreateFaction(req.body);
    const faction = await factionService.createFaction(
      req.params.projectId,
      req.userId,
      req.body,
    );
    res.status(201).json({ faction });
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    const filters = { search: req.query.search };
    const factions = await factionService.listFactions(
      req.params.projectId,
      filters,
    );
    res.json({ factions });
  } catch (err) {
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    const faction = await factionService.getFactionById(
      req.params.projectId,
      req.params.factionId,
    );
    res.json({ faction });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    validateUpdateFaction(req.body);
    const faction = await factionService.updateFaction(
      req.params.projectId,
      req.params.factionId,
      req.body,
    );
    res.json({ faction });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const result = await factionService.deleteFaction(
      req.params.projectId,
      req.params.factionId,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// --- Зв’язки персонаж-фракція ---

export async function addCharacter(req, res, next) {
  try {
    const { characterId, factionId, role } = req.body || {};
    if (!characterId || !factionId) {
      throw new ApiError(400, "characterId and factionId are required");
    }

    const link = await linkService.addCharacterToFaction(req.params.projectId, {
      characterId,
      factionId,
      role,
    });
    res.status(201).json({ link });
  } catch (err) {
    next(err);
  }
}

export async function listCharactersForFaction(req, res, next) {
  try {
    const links = await linkService.listCharactersForFaction(
      req.params.projectId,
      req.params.factionId,
    );
    res.json({ links });
  } catch (err) {
    next(err);
  }
}

export async function listFactionsForCharacter(req, res, next) {
  try {
    const links = await linkService.listFactionsForCharacter(
      req.params.projectId,
      req.params.characterId,
    );
    res.json({ links });
  } catch (err) {
    next(err);
  }
}

export async function updateLink(req, res, next) {
  try {
    const { role } = req.body || {};
    const link = await linkService.updateLinkRole(
      req.params.projectId,
      req.params.linkId,
      role ?? null,
    );
    res.json({ link });
  } catch (err) {
    next(err);
  }
}

export async function deleteLink(req, res, next) {
  try {
    const result = await linkService.deleteLink(
      req.params.projectId,
      req.params.linkId,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}
