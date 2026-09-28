import * as mapService from "../services/map.service.js";
import {
  validateCreateMarker,
  validateUpdateMarker,
  validateCreateLocationWithMarker,
  validateMapImage,
} from "../validators/map.validator.js";

export async function getMap(req, res, next) {
  try {
    const data = await mapService.getMap(req.params.projectId);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function createMarker(req, res, next) {
  try {
    validateCreateMarker(req.body);
    const marker = await mapService.createMarker(
      req.params.projectId,
      req.body,
    );
    res.status(201).json({ marker });
  } catch (err) {
    next(err);
  }
}

export async function createLocationWithMarker(req, res, next) {
  try {
    validateCreateLocationWithMarker(req.body);
    const marker = await mapService.createLocationWithMarker(
      req.params.projectId,
      req.userId,
      req.body,
    );
    res.status(201).json({ marker });
  } catch (err) {
    next(err);
  }
}

export async function updateMarker(req, res, next) {
  try {
    validateUpdateMarker(req.body);
    const marker = await mapService.updateMarker(
      req.params.projectId,
      req.params.markerId,
      req.body,
    );
    res.json({ marker });
  } catch (err) {
    next(err);
  }
}

export async function deleteMarker(req, res, next) {
  try {
    const result = await mapService.deleteMarker(
      req.params.projectId,
      req.params.markerId,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function setMapImage(req, res, next) {
  try {
    validateMapImage(req.body);
    const project = await mapService.updateMapImage(
      req.params.projectId,
      req.body.mapImageUrl ?? null,
    );
    res.json({ project });
  } catch (err) {
    next(err);
  }
}
