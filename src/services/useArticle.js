import { useState, useEffect } from "react";
import axios from "axios";

export const useArticle = (slug) => {
  const [data, setData] = useState({
    article: null,
    relatedArticles: [],
    loading: true,
    isBookmarked: false,
  });

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setData((prev) => ({ ...prev, loading: true }));
        const token = localStorage.getItem("token");
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/articles/${slug}`,
          config
        );
        const articleData = res.data.data || res.data;

        let related = [];
        if (articleData.category.id) {
          const relRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/articles`,
            {
              params: { category_id: articleData.category.id, limit: 10 },
            }
          );
          const list = relRes.data.data || relRes.data;
          related = list
            .filter((item) => item.id !== articleData.category.id)
            .slice(0, 5);
        }

        setData({
          article: articleData,
          relatedArticles: related,
          loading: false,
          isBookmarked: articleData.is_bookmarked || false,
        });
      } catch (error) {
        console.error("Error:", error);
        setData((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchArticle();
    window.scrollTo(0, 0);
  }, [slug]);

  return { ...data, setData };
};
