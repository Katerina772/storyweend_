import api from "./axios.js";

export const mapApi = {
  getMap: (projectId) =>
    api.get(`/projects/${projectId}/map`).then((r) => r.data),
  setMapImage: (projectId, mapImageUrl) =>
    api
      .put(`/projects/${projectId}/map/image`, { mapImageUrl })
      .then((r) => r.data),
  createMarker: (projectId, data) =>
    api.post(`/projects/${projectId}/map/markers`, data).then((r) => r.data),
  createLocationWithMarker: (projectId, data) =>
    api
      .post(`/projects/${projectId}/map/markers/with-location`, data)
      .then((r) => r.data),
  updateMarker: (projectId, markerId, data) =>
    api
      .put(`/projects/${projectId}/map/markers/${markerId}`, data)
      .then((r) => r.data),
  deleteMarker: (projectId, markerId) =>
    api
      .delete(`/projects/${projectId}/map/markers/${markerId}`)
      .then((r) => r.data),
};
