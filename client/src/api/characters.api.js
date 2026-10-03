import api from "./axios.js";

export const charactersApi = {
  list: (projectId, filters = {}) =>
    api
      .get(`/projects/${projectId}/characters`, { params: filters })
      .then((r) => r.data),
  getOne: (projectId, characterId) =>
    api
      .get(`/projects/${projectId}/characters/${characterId}`)
      .then((r) => r.data),
  create: (projectId, data) =>
    api.post(`/projects/${projectId}/characters`, data).then((r) => r.data),
  update: (projectId, characterId, data) =>
    api
      .put(`/projects/${projectId}/characters/${characterId}`, data)
      .then((r) => r.data),
  remove: (projectId, characterId) =>
    api
      .delete(`/projects/${projectId}/characters/${characterId}`)
      .then((r) => r.data),
};
