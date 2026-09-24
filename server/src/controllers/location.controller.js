import * as locationService from "../services/location.service.js";
import * as linkService from "../services/characterLocation.service.js";
import {
  validateCreateLocation,
  validateUpdateLocation,
} from "../validators/location.validator.js";
import { ApiError } from "../utils/ApiError.js";

// --- Локації ---

export async function create(req, res, next) {
  try {
    validateCreateLocation(req.body);
    const location = await locationService.createLocation(
      req.params.projectId,
      req.userId,
      req.body,
    );
    res.status(201).json({ location });
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    const filters = {
      type: req.query.type,
      search: req.query.search,
    };

    if (req.query.parentId !== undefined) {
      filters.parentId =
        req.query.parentId === "null" ? null : req.query.parentId;
    }

    const locations = await locationService.listLocations(
      req.params.projectId,
      filters,
    );
    res.json({ locations });
  } catch (err) {
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    const location = await locationService.getLocationById(
      req.params.projectId,
      req.params.locationId,
    );
    res.json({ location });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    validateUpdateLocation(req.body);
    const location = await locationService.updateLocation(
      req.params.projectId,
      req.params.locationId,
      req.body,
    );
    res.json({ location });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const result = await locationService.deleteLocation(
      req.params.projectId,
      req.params.locationId,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function listChildren(req, res, next) {
  try {
    const locations = await locationService.listChildLocations(
      req.params.projectId,
      req.params.locationId,
    );
    res.json({ locations });
  } catch (err) {
    next(err);
  }
}

// --- Зв’язки персонаж-локація ---

export async function linkCharacter(req, res, next) {
  try {
    const { characterId, locationId, type } = req.body || {};
    if (!characterId || !locationId) {
      throw new ApiError(400, "characterId and locationId are required");
    }

    const link = await linkService.linkCharacterToLocation(
      req.params.projectId,
      {
        characterId,
        locationId,
        type,
      },
    );
    res.status(201).json({ link });
  } catch (err) {
    next(err);
  }
}

export async function listLinksForCharacter(req, res, next) {
  try {
    const links = await linkService.listLinksForCharacter(
      req.params.projectId,
      req.params.characterId,
    );
    res.json({ links });
  } catch (err) {
    next(err);
  }
}

export async function listLinksForLocation(req, res, next) {
  try {
    const links = await linkService.listLinksForLocation(
      req.params.projectId,
      req.params.locationId,
    );
    res.json({ links });
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
