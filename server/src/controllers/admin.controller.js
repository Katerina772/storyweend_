import * as adminService from "../services/admin.service.js";
import * as logService from "../services/activityLog.service.js";

// --- Огляд ---

export async function overview(req, res, next) {
  try {
    const data = await adminService.getOverview();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

// --- Користувачі ---

export async function listUsers(req, res, next) {
  try {
    const users = await adminService.listUsers({
      role: req.query.role,
      search: req.query.search,
      limit: req.query.limit,
    });
    res.json({ users });
  } catch (err) {
    next(err);
  }
}

export async function getUser(req, res, next) {
  try {
    const user = await adminService.getUserById(req.params.userId);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function changeRole(req, res, next) {
  try {
    const { role } = req.body || {};
    const result = await adminService.changeUserRole(
      req.params.userId,
      role,
      req.userId,
    );

    await logService.log({
      userId: req.userId,
      action: "USER_ROLE_CHANGED",
      entityType: "user",
      entityId: req.params.userId,
      metadata: { oldRole: result.oldRole, newRole: role },
      ipAddress: req.ip,
    });

    res.json({ user: result.user });
  } catch (err) {
    next(err);
  }
}

// --- Проєкти ---

export async function listProjects(req, res, next) {
  try {
    const projects = await adminService.listProjects({
      search: req.query.search,
      limit: req.query.limit,
    });
    res.json({ projects });
  } catch (err) {
    next(err);
  }
}

export async function getProject(req, res, next) {
  try {
    const project = await adminService.getProjectStats(req.params.projectId);
    res.json({ project });
  } catch (err) {
    next(err);
  }
}

// --- Журнал дій ---

export async function listLogs(req, res, next) {
  try {
    const logs = await logService.listLogs({
      userId: req.query.userId,
      action: req.query.action,
      limit: req.query.limit,
    });
    res.json({ logs });
  } catch (err) {
    next(err);
  }
}
