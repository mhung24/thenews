import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Clock, Loader2, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import Header from "../components/Header";
import Footer from "../Footer/Footer";

export default function LatestArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  const fetchLatest = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/articles?status=published&page=${page}&limit=12`,
      );

      const serverResponse = res.data;
      if (serverResponse && serverResponse.status === 200) {
        setArticles(serverResponse.data);
        const pg = serverResponse.pagination;
        setPagination({
          current_page: pg.page,
          last_page: Math.ceil(pg.total / pg.limit),
          total: pg.total,
        });
      }
    } catch (error) {
      console.error("Lỗi tải tin mới nhất:", error);
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    fetchLatest();
  }, [fetchLatest]);

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans">
      <Header
        currentDate={new Date().toLocaleDateString("vi-VN", {
          weekday: "long",
          year: "numeric",
          month: "numeric",
          day: "numeric",
        })}
        setIsMobileMenuOpen={() => {}}
      />

      <main className="container mx-auto px-4 lg:px-8 py-10">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between border-b-4 border-red-700 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 text-red-700 mb-2 animate-pulse">
              <Zap size={20} fill="currentColor" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                Tin nóng 24/7
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-black uppercase italic text-gray-900 tracking-tighter">
              Mới cập nhật
            </h1>
          </div>
          <p className="text-gray-400 font-bold italic text-sm">
            Tổng số <span className="text-red-700">{pagination.total}</span> tin
            bài đã xuất bản
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-red-700 mb-4" size={48} />
            <p className="text-[10px] font-black uppercase tracking-widest italic text-gray-400">
              Đang đồng bộ dòng chảy tin tức...
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
                >
                  <Link
                    to={`/article/${article.slug}`}
                    className="relative overflow-hidden block aspect-video"
                  >
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}${article.image_url}`}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-700 text-white text-[9px] font-black px-2 py-1 rounded-sm uppercase tracking-wider">
                        {article.category?.name}
                      </span>
                    </div>
                  </Link>

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <Clock size={12} />
                      {article.created_at_human}
                    </div>

                    <Link to={`/article/${article.slug}`}>
                      <h2 className="text-xl font-bold font-serif leading-tight text-gray-900 group-hover:text-red-700 transition-colors line-clamp-2 uppercase italic mb-3">
                        {article.title}
                      </h2>
                    </Link>

                    <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed mb-6 font-medium">
                      {article.summary}
                    </p>

                    <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">
                        VN Daily News
                      </span>
                      <Link
                        to={`/article/${article.slug}`}
                        className="text-red-700 font-black text-[10px] uppercase tracking-widest hover:translate-x-1 transition-transform inline-flex items-center gap-1"
                      >
                        Chi tiết <ChevronRight size={12} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {pagination.last_page > 1 && (
              <div className="mt-20 flex justify-center items-center gap-4">
                <button
                  onClick={() => fetchLatest(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-red-700 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-300 transition-all shadow-md"
                >
                  <ChevronLeft size={16} /> Trước
                </button>

                <span className="font-serif italic font-bold text-gray-400">
                  Trang{" "}
                  <span className="text-red-700 text-xl">
                    {pagination.current_page}
                  </span>{" "}
                  / {pagination.last_page}
                </span>

                <button
                  onClick={() => fetchLatest(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-red-700 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-300 transition-all shadow-md"
                >
                  Sau <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
