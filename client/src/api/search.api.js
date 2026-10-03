import api from "./axios.js";

export const searchApi = {
  search: (projectId, q) =>
    api
      .get(`/projects/${projectId}/search`, { params: { q } })
      .then((r) => r.data),
  exportProject: (projectId, download = false) =>
    api
      .get(`/projects/${projectId}/export`, { params: { download } })
      .then((r) => r.data),
};
