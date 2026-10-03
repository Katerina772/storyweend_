import api from "./axios.js";

export const factionsApi = {
  list: (projectId, filters = {}) =>
    api
      .get(`/projects/${projectId}/factions`, { params: filters })
      .then((r) => r.data),
  getOne: (projectId, factionId) =>
    api.get(`/projects/${projectId}/factions/${factionId}`).then((r) => r.data),
  create: (projectId, data) =>
    api.post(`/projects/${projectId}/factions`, data).then((r) => r.data),
  update: (projectId, factionId, data) =>
    api
      .put(`/projects/${projectId}/factions/${factionId}`, data)
      .then((r) => r.data),
  remove: (projectId, factionId) =>
    api
      .delete(`/projects/${projectId}/factions/${factionId}`)
      .then((r) => r.data),
};
