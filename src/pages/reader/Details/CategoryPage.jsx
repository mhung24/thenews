import React, { useState, useEffect } from "react";
import {
  useParams,
  useSearchParams,
  Link,
  useLocation,
} from "react-router-dom";
import axios from "axios";
import { Clock, ChevronRight, Loader2, Calendar } from "lucide-react";
import Footer from "../Home/Footer/Footer";
import Header from "../Home/components/Header";

export default function CategoryPage() {
  const { slug, tagName } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const searchQuery = searchParams.get("q");

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setArticles([]);

        let url = `${import.meta.env.VITE_API_URL}/articles`;
        let params = { status: "published" };

        if (slug) {
          params.category = slug;
        } else if (tagName) {
          params.tag = tagName;
        } else if (searchQuery) {
          params.search = searchQuery;
        }

        const res = await axios.get(url, { params });
        const resultData = res.data.data || res.data;
        setArticles(resultData);

        if (searchQuery) {
          setPageTitle(`Kết quả tìm kiếm: "${searchQuery}"`);
        } else if (tagName) {
          setPageTitle(`Thẻ: #${tagName}`);
        } else if (slug) {
          if (Array.isArray(resultData) && resultData.length > 0) {
            const articleWithCat = resultData.find(
              (a) => a.category && a.category.name,
            );
            if (articleWithCat) {
              setPageTitle(`Chuyên mục: ${articleWithCat.category.name}`);
            } else {
              setPageTitle(`Chuyên mục: ${slug.replace(/-/g, " ")}`);
            }
          } else {
            const tempTitle = slug.replace(/-/g, " ");
            setPageTitle(
              `Chuyên mục: ${tempTitle.charAt(0).toUpperCase() + tempTitle.slice(1)}`,
            );
          }
        } else {
          setPageTitle("Tất cả bài viết");
        }
      } catch (error) {
        console.error("Lỗi khi tải bài viết:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
    window.scrollTo(0, 0);
  }, [slug, tagName, searchQuery, location.pathname]);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <Header
        currentDate={new Date().toLocaleDateString("vi-VN", {
          weekday: "long",
          year: "numeric",
          month: "numeric",
          day: "numeric",
        })}
        setIsMobileMenuOpen={() => {}}
      />

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="mb-10 border-b-2 border-red-700 pb-4">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 italic">
            <Link to="/" className="hover:text-red-700">
              Trang chủ
            </Link>
            <ChevronRight size={10} />
            <span className="text-red-700">{pageTitle}</span>
          </nav>
          <h1 className="text-3xl font-serif font-bold uppercase italic text-gray-900 tracking-tighter">
            {pageTitle}
          </h1>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Loader2 className="animate-spin mb-4 text-red-700" size={40} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] italic text-center">
              Đang tải tin tức mới nhất...
            </p>
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {articles.map((article) => (
              <article key={article.id} className="group flex flex-col">
                <Link
                  to={`/article/${article.slug}`}
                  className="block overflow-hidden rounded-xl mb-5 shadow-sm"
                >
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}${article.image_url}`}
                    alt={article.title}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </Link>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-[10px] font-black text-red-700 uppercase italic">
                    <span className="bg-red-50 px-2 py-0.5 rounded">
                      {article.category?.name}
                    </span>
                    <span className="text-gray-400 flex items-center gap-1 font-bold">
                      <Clock size={12} /> {article.created_at_human}
                    </span>
                  </div>
                  <Link to={`/article/${article.slug}`}>
                    <h2 className="text-xl font-bold leading-tight text-gray-900 group-hover:text-red-700 transition-colors line-clamp-2 uppercase italic font-serif">
                      {article.title}
                    </h2>
                  </Link>
                  <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed font-medium">
                    {article.summary || article.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 italic font-black uppercase tracking-widest text-sm mb-6">
              Hiện chưa có bài viết nào trong mục này.
            </p>
            <Link
              to="/"
              className="px-8 py-3 bg-red-700 text-white font-black uppercase text-xs rounded-full hover:bg-red-800 transition-all shadow-lg"
            >
              Quay lại trang chủ
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
