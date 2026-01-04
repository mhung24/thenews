import api from "./api";

export const dashboardService = {
  getStats: () => api.get("/moderator/stats"),

  getPendingArticles: () => api.get("/moderator/articles/pending"),

  getArticleDetail: (id) => api.get(`/moderator/articles/${id}`),

  approveArticle: (id) => api.patch(`/moderator/articles/${id}/approve`),

  getReportData: (period) => api.get(`/moderator/report?period=${period}`),

  getStatistics: (range) => api.get(`/moderator/statistics?range=${range}`),

  rejectArticle: (id) => api.patch(`/moderator/articles/${id}/reject`),

  updateArticleStatus: (id, data) =>
    api.patch(`/moderator/articles/${id}/status`, data),
};
