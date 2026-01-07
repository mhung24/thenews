import api from "./api";

export const dashboardService = {
  getStats: () => api.get("/moderator/stats"),

  getPendingArticles: () => api.get("/moderator/articles/pending"),

  getArticleDetail: (id) => api.get(`/moderator/articles/${id}`),

  approveArticle: (id) =>
    api.patch(`/moderator/articles/${id}/status`, {
      status: "published",
      review_note: "Bài viết đã được phê duyệt.",
    }),

  getReportData: (period) => api.get(`/moderator/report?period=${period}`),

  getStatistics: (range) => api.get(`/moderator/statistics?range=${range}`),

  rejectArticle: (id) =>
    api.patch(`/moderator/articles/${id}/status`, {
      status: "rejected",
      review_note: "Nội dung không phù hợp hoặc vi phạm quy định.",
    }),

  updateArticleStatus: (id, data) =>
    api.patch(`/moderator/articles/${id}/status`, data),
  getAllArticles: (params) => api.get("/moderator/articles", { params }),
  deleteArticle: (id) => api.delete(`/moderator/articles/${id}`),
};
