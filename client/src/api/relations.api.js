import api from "./axios.js";

export const relationsApi = {
  list: (projectId, filters = {}) =>
    api
      .get(`/projects/${projectId}/relations`, { params: filters })
      .then((r) => r.data),
  create: (projectId, data) =>
    api.post(`/projects/${projectId}/relations`, data).then((r) => r.data),
  update: (projectId, relationId, data) =>
    api
      .put(`/projects/${projectId}/relations/${relationId}`, data)
      .then((r) => r.data),
  remove: (projectId, relationId) =>
    api
      .delete(`/projects/${projectId}/relations/${relationId}`)
      .then((r) => r.data),
  graph: (projectId) =>
    api.get(`/projects/${projectId}/relations/graph`).then((r) => r.data),
  types: (projectId) =>
    api.get(`/projects/${projectId}/relations/types`).then((r) => r.data),
};
