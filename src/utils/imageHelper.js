// src/utils/imageHelper.js

export const getImageUrl = (path) => {
  if (!path) return "https://placehold.co/200x120?text=No+Image";

  if (path.startsWith("http") || path.startsWith("https")) {
    return path;
  }
  const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

  return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
};
