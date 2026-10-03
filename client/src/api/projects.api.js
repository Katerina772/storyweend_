import api from "./axios.js";

export const projectsApi = {
  listMine: () => api.get("/projects/mine").then((r) => r.data),
  listShared: () => api.get("/projects/shared").then((r) => r.data),
  getOne: (id) => api.get(`/projects/${id}`).then((r) => r.data),
  create: (data) => api.post("/projects", data).then((r) => r.data),
  update: (id, data) => api.put(`/projects/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/projects/${id}`).then((r) => r.data),

  // Учасники
  listMembers: (projectId) =>
    api.get(`/projects/${projectId}/members`).then((r) => r.data),
  addMember: (projectId, data) =>
    api.post(`/projects/${projectId}/members`, data).then((r) => r.data),
  updateMemberRole: (projectId, memberId, role) =>
    api
      .put(`/projects/${projectId}/members/${memberId}`, { role })
      .then((r) => r.data),
  removeMember: (projectId, memberId) =>
    api
      .delete(`/projects/${projectId}/members/${memberId}`)
      .then((r) => r.data),
};
