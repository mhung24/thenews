import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Clock,
  ChevronRight,
  Loader2,
  BookmarkX,
  ArrowLeft,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../Footer/Footer";

export default function BookmarksPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
    window.scrollTo(0, 0);
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/bookmarks`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setArticles(res.data.data || res.data);
    } catch (error) {
      console.error("Lỗi khi tải tin đã lưu:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (articleId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/bookmarks/${articleId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setArticles(articles.filter((item) => item.id !== articleId));
    } catch (error) {
      console.error("Lỗi khi xóa bookmark:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header currentDate={new Date().toLocaleDateString("vi-VN")} />

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="mb-10 border-b-2 border-red-700 pb-4">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 italic">
            <Link to="/" className="hover:text-red-700 flex items-center gap-1">
              <ArrowLeft size={12} /> Trang chủ
            </Link>
            <ChevronRight size={10} />
            <span className="text-red-700 italic font-black uppercase tracking-widest text-[10px]">
              Tin đã lưu của bạn
            </span>
          </nav>
          <h1 className="text-3xl font-serif font-bold uppercase italic text-gray-900 tracking-tighter">
            Kho lưu trữ cá nhân
          </h1>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="text-xs font-bold uppercase tracking-widest italic">
              Đang mở kho lưu trữ...
            </p>
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article
                key={article.id}
                className="group border-b border-gray-100 pb-8 last:border-0 relative"
              >
                <Link
                  to={`/article/${article.slug}`}
                  className="block overflow-hidden rounded-sm mb-4"
                >
                  <img
                    src={article.image_url || "/placeholder.jpg"}
                    alt={article.title}
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                {/* Nút xóa Bookmark nhanh */}
                <button
                  onClick={() => removeBookmark(article.id)}
                  className="absolute top-2 right-2 p-2 bg-white/90 text-gray-400 hover:text-red-700 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                  title="Xóa khỏi danh sách lưu"
                >
                  <BookmarkX size={18} />
                </button>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-[10px] font-black text-red-700 uppercase italic">
                    <span>{article.category?.name}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="text-gray-400 flex items-center gap-1">
                      <Clock size={12} /> {article.created_at_human}
                    </span>
                  </div>
                  <Link to={`/article/${article.slug}`}>
                    <h2 className="text-xl font-bold leading-tight text-gray-900 group-hover:text-red-700 transition-colors line-clamp-2 uppercase italic font-serif">
                      {article.title}
                    </h2>
                  </Link>
                  <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                    {article.summary || article.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
            <div className="mb-6 flex justify-center text-gray-200">
              <BookmarkX size={64} strokeWidth={1} />
            </div>
            <p className="text-gray-400 italic font-bold uppercase tracking-widest">
              Bạn chưa lưu bài viết nào.
            </p>
            <Link
              to="/"
              className="inline-block mt-6 px-8 py-3 bg-red-700 text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-lg shadow-red-100"
            >
              Khám phá tin tức ngay
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
