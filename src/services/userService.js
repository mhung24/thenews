import api from "./api";

export const userService = {
  getProfile: () => api.get("/user"),

  getUsers: (params) => api.get("/users", { params }),

  create: (data) => api.post("/users", data),

  importExcel: (data) => api.post("/users/import", { users: data }),

  update: (id, data) => api.put(`/users/${id}`, data),

  delete: (id) => api.delete(`/users/${id}`),

  toggleStatus: (id, data) => api.patch(`/users/${id}/status`, data),

  resetPassword: (id, data) => api.patch(`/users/${id}/reset-password`, data),

  updateProfile: (data) => api.put("/profile/update", data),

  changePassword: (data) => api.put("/profile/password", data),
  toggleRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  uploadAvatar: (formData) =>
    api.post("/profile/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
