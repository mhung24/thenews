import React, { useState, useEffect } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  ChevronRight,
  Clock,
  ThumbsUp,
  ArrowUp,
  Loader2,
  Calendar,
} from "lucide-react";
import AuthModal from "../Home/Auth/AuthModal";
import Footer from "../Home/Footer/Footer";
import Header from "../Home/components/Header";
import SocialSidebar from "./SocialSidebar";
import CommentSection from "./CommentSection";
import RelatedSidebar from "./RelatedSidebar";
import { useArticle } from "../../../services/useArticle";

export default function VNDailyDetail() {
  const { slug } = useParams();
  const { article, relatedArticles, loading, isBookmarked, setData } =
    useArticle(slug);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [currentDate] = useState(() => {
    return new Date().toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      setScrollProgress(windowHeight > 0 ? totalScroll / windowHeight : 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen font-sans">
        <Loader2 className="animate-spin text-red-700 mb-2" size={40} />
        <p className="text-gray-500 font-black uppercase italic tracking-widest">
          Đang tải nội dung...
        </p>
      </div>
    );

  if (!article)
    return (
      <div className="text-center py-20 font-sans uppercase italic">
        <h2 className="text-2xl font-black">404 - KHÔNG TÌM THẤY BÀI VIẾT</h2>
        <RouterLink
          to="/"
          className="text-red-700 hover:underline mt-4 inline-block font-bold"
        >
          VỀ TRANG CHỦ
        </RouterLink>
      </div>
    );

  return (
    <div className="bg-white min-h-screen font-sans text-gray-800 flex flex-col relative">
      <div
        className="fixed top-0 left-0 h-1 bg-red-700 z-[100] transition-all duration-100"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        currentDate={currentDate}
      />

      <AuthModal
        authMode={authMode}
        setAuthMode={setAuthMode}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />

      <main className="container mx-auto px-4 lg:px-8 py-10 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <SocialSidebar
            isBookmarked={isBookmarked}
            setIsBookmarked={(val) =>
              setData((prev) => ({ ...prev, isBookmarked: val }))
            }
            commentCount={article.comment_count}
            articleId={article.id}
            setAuthMode={setAuthMode}
          />

          <div className="lg:col-span-8">
            <article>
              <nav className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 italic">
                <RouterLink to="/" className="hover:text-red-700 transition">
                  Trang chủ
                </RouterLink>
                <ChevronRight size={12} />
                <span className="text-red-700">{article.category?.name}</span>
              </nav>

              <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 leading-[1.1] mb-8 uppercase italic tracking-tighter">
                {article.title}
              </h1>

              <div className="flex items-center gap-4 mb-10">
                <RouterLink
                  to={`/author/${article.author?.id}`}
                  className="group relative"
                >
                  {article.author?.avatar ? (
                    <img
                      src={`${article.author.avatar}`}
                      alt={article.author.name}
                      className="w-12 h-12 rounded-full object-cover shadow-lg shadow-red-100 ring-2 ring-transparent group-hover:ring-red-700 transition-all"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-red-700 text-white flex items-center justify-center font-serif font-bold text-xl italic shadow-lg shadow-red-100 group-hover:scale-105 transition-all">
                      {article.author?.name?.charAt(0)}
                    </div>
                  )}
                </RouterLink>
                <div>
                  <RouterLink
                    to={`/author/${article.author?.id}`}
                    className="font-bold text-gray-900 text-sm uppercase hover:text-red-700 transition-colors"
                  >
                    {article.author?.name}
                  </RouterLink>
                  <div className="flex items-center gap-3 text-[11px] text-gray-400 font-bold uppercase mt-0.5 tracking-tighter">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(article.created_at).toLocaleDateString("vi-VN")}
                    </span>
                    <span className="flex items-center gap-1 text-red-600">
                      <Clock size={12} />
                      {new Date(article.created_at).toLocaleTimeString(
                        "vi-VN",
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xl font-bold text-gray-700 leading-relaxed mb-10 italic border-l-4 border-red-700 pl-8 py-4 bg-gray-50/50 rounded-r-xl shadow-sm">
                {article.summary}
              </p>

              {article.image_url && (
                <figure className="mb-12">
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}${
                      article.image_url
                    }`}
                    alt={article.title}
                    className="w-full rounded-[2rem] shadow-2xl object-cover ring-8 ring-gray-50/50"
                  />
                  {article.image_caption && (
                    <figcaption className="text-center mt-4 text-gray-500 font-medium italic text-sm">
                      {article.image_caption}
                    </figcaption>
                  )}
                </figure>
              )}

              <div
                className="article-content-wrapper prose prose-lg prose-red max-w-none text-gray-800 leading-[1.8] text-justify font-serif"
                style={{
                  fontSize: `18px`,
                  textAlignLast: "left",
                  textJustify: "inter-word",
                  WebkitHyphens: "auto",
                  hyphens: "auto",
                }}
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              <div className="mt-12 flex flex-col items-end border-t border-gray-50 pt-6">
                <div className="text-right">
                  <p className="text-lg font-black text-gray-900 uppercase italic tracking-tighter">
                    {article.author?.name}
                  </p>
                  <div className="flex items-center justify-end gap-2 text-gray-400 mt-1">
                    <Clock size={12} />
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      Cập nhật:{" "}
                      {new Date(article.created_at).toLocaleTimeString(
                        "vi-VN",
                        { hour: "2-digit", minute: "2-digit" }
                      )}{" "}
                      -{" "}
                      {new Date(article.created_at).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
              </div>
            </article>

            <div className="flex flex-wrap gap-2 mt-16 pt-10 border-t border-gray-100">
              {article.tags?.map((tag) => (
                <RouterLink
                  key={tag.id}
                  to={`/tag/${tag.id}`}
                  className="px-5 py-2 bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-red-700 hover:text-white transition-all border border-gray-100 shadow-sm"
                >
                  #{tag.name}
                </RouterLink>
              ))}
            </div>

            <div className="mt-10">
              <CommentSection
                articleId={article.id}
                comments={article.comments}
                setAuthMode={setAuthMode}
              />
            </div>
          </div>

          <RelatedSidebar relatedArticles={relatedArticles} />
        </div>
      </main>

      <Footer />

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-8 right-8 bg-red-700 text-white p-4 rounded-2xl shadow-2xl transition-all duration-500 hover:scale-110 z-50 shadow-red-200 ${
          scrollProgress > 0.05
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <ArrowUp size={24} />
      </button>

      <style>{`
  .article-content-wrapper {
    max-width: 100% !important;
  }

  .article-content-wrapper figure {
    margin: 3rem auto !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important; 
    width: 100% !important;
  }

  .article-content-wrapper img {
    max-width: 100% !important;
    width: auto !important;
    height: auto !important;
    border-radius: 1rem !important;
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
    margin: 0 auto !important;
    display: block !important;
  }

  .article-content-wrapper figcaption {
    margin-top: 1rem !important;
    font-style: italic !important;
    color: #64748b !important; /* Màu slate-500 chuẩn */
    font-size: 0.9rem !important;
    line-height: 1.6 !important;
    text-align: center !important; /* Căn chữ vào giữa */
    width: 100% !important;
    display: block !important;
  }

  .prose blockquote {
    border-left-color: #b91c1c !important;
    font-style: italic !important;
    background-color: #fef2f2 !important;
    padding: 1.5rem !important;
    border-radius: 0 1rem 1rem 0 !important;
    margin: 2rem 0 !important;
  }
`}</style>
    </div>
  );
}
