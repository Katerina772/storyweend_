// import api from "./axios.js";

// export const loreApi = {
//   list: (projectId, filters = {}) =>
//     api
//       .get(`/projects/${projectId}/lore`, { params: filters })
//       .then((r) => r.data),
//   getOne: (projectId, loreId) =>
//     api.get(`/projects/${projectId}/lore/${loreId}`).then((r) => r.data),
//   create: (projectId, data) =>
//     api.post(`/projects/${projectId}/lore`, data).then((r) => r.data),
//   update: (projectId, loreId, data) =>
//     api.put(`/projects/${projectId}/lore/${loreId}`, data).then((r) => r.data),
//   remove: (projectId, loreId) =>
//     api.delete(`/projects/${projectId}/lore/${loreId}`).then((r) => r.data),
//   categories: (projectId) =>
//     api.get(`/projects/${projectId}/lore/categories`).then((r) => r.data),
// };

import api from "./axios.js";

export const loreApi = {
  list: (projectId, filters = {}) =>
    api
      .get(`/projects/${projectId}/lore`, { params: filters })
      .then((r) => r.data),
  getOne: (projectId, loreId) =>
    api.get(`/projects/${projectId}/lore/${loreId}`).then((r) => r.data),
  create: (projectId, data) =>
    api.post(`/projects/${projectId}/lore`, data).then((r) => r.data),
  update: (projectId, loreId, data) =>
    api.put(`/projects/${projectId}/lore/${loreId}`, data).then((r) => r.data),
  remove: (projectId, loreId) =>
    api.delete(`/projects/${projectId}/lore/${loreId}`).then((r) => r.data),
  categories: (projectId) =>
    api.get(`/projects/${projectId}/lore/categories`).then((r) => r.data),
};
