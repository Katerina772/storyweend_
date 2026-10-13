import api from "./axios.js";

export const adminApi = {
  // Огляд
  overview: () => api.get("/admin/overview").then((r) => r.data),

  // Користувачі
  listUsers: (filters = {}) =>
    api.get("/admin/users", { params: filters }).then((r) => r.data),
  getUser: (userId) => api.get(`/admin/users/${userId}`).then((r) => r.data),
  changeRole: (userId, role) =>
    api.put(`/admin/users/${userId}/role`, { role }).then((r) => r.data),

  // Проєкти
  listProjects: (filters = {}) =>
    api.get("/admin/projects", { params: filters }).then((r) => r.data),
  getProject: (projectId) =>
    api.get(`/admin/projects/${projectId}`).then((r) => r.data),

  // Журнал
  listLogs: (filters = {}) =>
    api.get("/admin/logs", { params: filters }).then((r) => r.data),
};
