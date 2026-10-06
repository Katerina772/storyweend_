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

  // Зв’язки персонаж-фракція
  addCharacter: (projectId, data) =>
    api.post(`/projects/${projectId}/factions/links`, data).then((r) => r.data),
  listCharactersForFaction: (projectId, factionId) =>
    api
      .get(`/projects/${projectId}/factions/${factionId}/characters`)
      .then((r) => r.data),
  updateLink: (projectId, linkId, role) =>
    api
      .put(`/projects/${projectId}/factions/links/${linkId}`, { role })
      .then((r) => r.data),
  deleteLink: (projectId, linkId) =>
    api
      .delete(`/projects/${projectId}/factions/links/${linkId}`)
      .then((r) => r.data),
};
