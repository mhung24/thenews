import React, { useState, useEffect } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { ChevronRight, Clock, ThumbsUp, ArrowUp, Loader2 } from "lucide-react";
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
            {/* Gom tất cả vào trong 1 thẻ div bọc để đảm bảo thứ tự từ trên xuống */}
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

              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-8 mb-10 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-700 text-white flex items-center justify-center font-serif font-bold text-xl italic shadow-lg shadow-red-100">
                    {article.author?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm uppercase">
                      {article.author?.name}
                    </p>
                    <p className="text-[11px] text-gray-400 font-bold uppercase mt-0.5 tracking-tighter">
                      {new Date(article.created_at).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-5 text-gray-400 text-[10px] font-black uppercase tracking-widest italic">
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} /> 5 PHÚT ĐỌC
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ThumbsUp size={14} /> {article.views || 0} LƯỢT XEM
                  </span>
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
                </figure>
              )}

              <div
                className="prose prose-lg prose-red max-w-none text-gray-800 leading-[1.8] text-justify font-serif"
                style={{
                  fontSize: `18px`,
                  textAlignLast: "left",
                  textJustify: "inter-word",
                  WebkitHyphens: "auto",
                  hyphens: "auto",
                }}
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
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
    </div>
  );
}
