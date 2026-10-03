import * as searchService from "../services/search.service.js";
import * as exportService from "../services/export.service.js";
import { ApiError } from "../utils/ApiError.js";

export async function search(req, res, next) {
  try {
    const { q } = req.query;
    const results = await searchService.searchInProject(
      req.params.projectId,
      q,
    );
    res.json(results);
  } catch (err) {
    next(err);
  }
}

export async function exportProject(req, res, next) {
  try {
    const data = await exportService.exportProject(
      req.params.projectId,
      req.userId,
    );

    // Якщо клієнт просить завантажити файл — ставимо заголовки
    const download = req.query.download === "true";
    if (download) {
      const filename = `project-${data.project.id}-${Date.now()}.json`;
      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`,
      );
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
}
