import api from "./api";

export const authorService = {
  getProfile: (id) => api.get(`/authors/${id}`),
  toggleFollow: (id) => api.post(`/authors/${id}/follow`),
  reportAuthor: (id, data) => api.post(`/authors/${id}/report`, data),
};
