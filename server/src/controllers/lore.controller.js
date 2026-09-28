import * as loreService from "../services/lore.service.js";
import {
  validateCreateLore,
  validateUpdateLore,
} from "../validators/lore.validator.js";

export async function create(req, res, next) {
  try {
    validateCreateLore(req.body);
    const lore = await loreService.createLore(
      req.params.projectId,
      req.userId,
      req.body,
    );
    res.status(201).json({ lore });
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    const filters = {
      category: req.query.category,
      search: req.query.search,
    };
    const lore = await loreService.listLore(req.params.projectId, filters);
    res.json({ lore });
  } catch (err) {
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    const lore = await loreService.getLoreById(
      req.params.projectId,
      req.params.loreId,
    );
    res.json({ lore });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    validateUpdateLore(req.body);
    const lore = await loreService.updateLore(
      req.params.projectId,
      req.params.loreId,
      req.body,
    );
    res.json({ lore });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const result = await loreService.deleteLore(
      req.params.projectId,
      req.params.loreId,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function categories(req, res, next) {
  try {
    const categories = await loreService.listCategories(req.params.projectId);
    res.json({ categories });
  } catch (err) {
    next(err);
  }
}
