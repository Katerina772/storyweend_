import api from "./axios.js";

export const locationsApi = {
  list: (projectId, filters = {}) =>
    api
      .get(`/projects/${projectId}/locations`, { params: filters })
      .then((r) => r.data),
  getOne: (projectId, locationId) =>
    api
      .get(`/projects/${projectId}/locations/${locationId}`)
      .then((r) => r.data),
  create: (projectId, data) =>
    api.post(`/projects/${projectId}/locations`, data).then((r) => r.data),
  update: (projectId, locationId, data) =>
    api
      .put(`/projects/${projectId}/locations/${locationId}`, data)
      .then((r) => r.data),
  remove: (projectId, locationId) =>
    api
      .delete(`/projects/${projectId}/locations/${locationId}`)
      .then((r) => r.data),
  listChildren: (projectId, locationId) =>
    api
      .get(`/projects/${projectId}/locations/${locationId}/children`)
      .then((r) => r.data),
};
