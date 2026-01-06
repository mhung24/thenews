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
        let url = `${import.meta.env.VITE_API_URL}/articles`;
        let params = {};

        // Sửa category_slug thành category để khớp với Backend ArticleController@index
        if (slug) {
          params.category = slug;
          setPageTitle(`Chuyên mục: ${slug.replace(/-/g, " ")}`);
        } else if (tagName) {
          params.tag = tagName;
          setPageTitle(`Thẻ: #${tagName}`);
        } else if (searchQuery) {
          params.search = searchQuery;
          setPageTitle(`Kết quả tìm kiếm cho: "${searchQuery}"`);
        } else if (location.pathname === "/search") {
          setPageTitle("Tất cả bài viết");
        }

        const res = await axios.get(url, { params });
        setArticles(res.data.data || res.data);
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
    <div className="min-h-screen bg-white font-sans">
      <Header
        currentDate={new Date().toLocaleDateString("vi-VN")}
        setIsMobileMenuOpen={() => {}} // Thêm prop để tránh lỗi crash đã gặp
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
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="text-xs font-bold uppercase tracking-widest italic text-center">
              Đang tải dòng chảy tin tức...
            </p>
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article
                key={article.id}
                className="group border-b border-gray-100 pb-8 last:border-0"
              >
                <Link
                  to={`/article/${article.slug}`}
                  className="block overflow-hidden rounded-sm mb-4"
                >
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}${
                      article.image_url
                    }`}
                    alt={article.title}
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
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
                  <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">
                    {article.summary || article.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 italic font-bold uppercase tracking-widest">
              Rất tiếc, không tìm thấy bài viết nào phù hợp.
            </p>
            <Link
              to="/"
              className="inline-block mt-6 text-red-700 font-black uppercase text-xs border-b-2 border-red-700 pb-1"
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
