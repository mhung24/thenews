import api from "./articleService";

export const reportService = {
  getAll: (params) => api.get("/moderator/reports", { params }),

  updateStatus: (id, data) =>
    api.patch(`/moderator/reports/${id}/status`, data),

  banUser: (userId) => api.post(`/moderator/users/${userId}/ban`),
};
