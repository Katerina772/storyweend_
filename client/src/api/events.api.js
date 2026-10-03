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
};
