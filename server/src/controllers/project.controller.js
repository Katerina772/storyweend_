import * as projectService from "../services/project.service.js";
import {
  validateCreateProject,
  validateUpdateProject,
} from "../validators/project.validator.js";

export async function create(req, res, next) {
  try {
    validateCreateProject(req.body);
    const project = await projectService.createProject(req.userId, req.body);
    res.status(201).json({ project });
  } catch (err) {
    next(err);
  }
}

export async function listMine(req, res, next) {
  try {
    const projects = await projectService.listMyProjects(req.userId);
    res.json({ projects });
  } catch (err) {
    next(err);
  }
}

export async function listShared(req, res, next) {
  try {
    const projects = await projectService.listSharedProjects(req.userId);
    res.json({ projects });
  } catch (err) {
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    const project = await projectService.getProjectById(
      req.params.id,
      req.userId,
    );
    res.json({ project });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    validateUpdateProject(req.body);
    const project = await projectService.updateProject(req.params.id, req.body);
    res.json({ project });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const result = await projectService.deleteProject(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function overview(req, res, next) {
  try {
    const data = await projectService.getProjectOverview(req.params.projectId);
    res.json(data);
  } catch (err) {
    next(err);
  }
}
