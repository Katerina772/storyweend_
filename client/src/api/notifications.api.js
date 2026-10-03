import api from "./axios.js";

export const notificationsApi = {
  list: (filters = {}) =>
    api.get("/notifications", { params: filters }).then((r) => r.data),
  unreadCount: () => api.get("/notifications/unread-count").then((r) => r.data),
  markAsRead: (id) => api.put(`/notifications/${id}/read`).then((r) => r.data),
  markAllAsRead: () => api.put("/notifications/read-all").then((r) => r.data),
  remove: (id) => api.delete(`/notifications/${id}`).then((r) => r.data),
  clearRead: () => api.delete("/notifications/read").then((r) => r.data),
};
