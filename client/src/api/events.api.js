import api from "./axios.js";

export const eventsApi = {
  list: (projectId, filters = {}) =>
    api
      .get(`/projects/${projectId}/events`, { params: filters })
      .then((r) => r.data),
  getOne: (projectId, eventId) =>
    api.get(`/projects/${projectId}/events/${eventId}`).then((r) => r.data),
  create: (projectId, data) =>
    api.post(`/projects/${projectId}/events`, data).then((r) => r.data),
  update: (projectId, eventId, data) =>
    api
      .put(`/projects/${projectId}/events/${eventId}`, data)
      .then((r) => r.data),
  remove: (projectId, eventId) =>
    api.delete(`/projects/${projectId}/events/${eventId}`).then((r) => r.data),

  // Зв’язки подія-персонаж
  addCharacter: (projectId, data) =>
    api.post(`/projects/${projectId}/events/links`, data).then((r) => r.data),
  listCharactersForEvent: (projectId, eventId) =>
    api
      .get(`/projects/${projectId}/events/${eventId}/characters`)
      .then((r) => r.data),
  updateLink: (projectId, linkId, role) =>
    api
      .put(`/projects/${projectId}/events/links/${linkId}`, { role })
      .then((r) => r.data),
  deleteLink: (projectId, linkId) =>
    api
      .delete(`/projects/${projectId}/events/links/${linkId}`)
      .then((r) => r.data),
};
