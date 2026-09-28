import * as relationService from "../services/characterRelation.service.js";
import {
  validateCreateRelation,
  validateUpdateRelation,
  RELATION_TYPES_LIST,
} from "../validators/relation.validator.js";

export async function create(req, res, next) {
  try {
    validateCreateRelation(req.body);
    const relation = await relationService.createRelation(
      req.params.projectId,
      req.body,
    );
    res.status(201).json({ relation });
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    const filters = {
      type: req.query.type,
      characterId: req.query.characterId,
    };
    const relations = await relationService.listRelations(
      req.params.projectId,
      filters,
    );
    res.json({ relations });
  } catch (err) {
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    const relation = await relationService.getRelationById(
      req.params.projectId,
      req.params.relationId,
    );
    res.json({ relation });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    validateUpdateRelation(req.body);
    const relation = await relationService.updateRelation(
      req.params.projectId,
      req.params.relationId,
      req.body,
    );
    res.json({ relation });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const result = await relationService.deleteRelation(
      req.params.projectId,
      req.params.relationId,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function graph(req, res, next) {
  try {
    const data = await relationService.getGraph(req.params.projectId);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function types(req, res, next) {
  res.json({ types: RELATION_TYPES_LIST });
}
