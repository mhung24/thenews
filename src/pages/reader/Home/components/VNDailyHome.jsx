import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Thay đổi ở đây
import { Clock, Loader2 } from "lucide-react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "../Footer/Footer";

export default function VNDailyHome() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const MARKET_DATA = [
    { name: "VN-Index", value: "1,258.40", change: "+12.5", isUp: true },
    { name: "Vàng SJC", value: "84.50", change: "-0.2", isUp: false },
    { name: "USD", value: "25,400", change: "+10", isUp: true },
    { name: "EUR", value: "27,100", change: "-50", isUp: false },
  ];

  useEffect(() => {
    // Định dạng ngày tháng tiếng Việt chuẩn
    const now = new Date();
    const formattedDate = now.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    setCurrentDate(
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1),
    );

    const fetchData = async () => {
      try {
        // Gọi API lấy bài viết đã xuất bản
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/articles?status=published&limit=20`,
        );

        // SỬA TẠI ĐÂY: Khớp với cấu trúc { status: 200, data: [...] } của Backend bạn vừa sửa
        const result = res.data;
        if (result && result.status === 200) {
          setArticles(result.data || []);
        }
      } catch (e) {
        console.error("Lỗi tải bài viết:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-red-700" size={40} />
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
            Đang cập nhật tin tức...
          </p>
        </div>
      </div>
    );

  // Phân bổ bài viết cho giao diện
  const hero = articles[0];
  const spotlight = articles.slice(1, 4);
  const latest = articles.slice(4); // Lấy các bài còn lại cho mục "Mới cập nhật"

  return (
    <div className="bg-white min-h-screen font-sans text-gray-800 flex flex-col">
      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        currentDate={currentDate}
      />

      {/* Breaking News Bar */}
      <div className="bg-red-50 border-b border-red-100 py-2">
        <div className="container mx-auto px-4 lg:px-8 flex items-center gap-3">
          <span className="text-[10px] font-black bg-red-700 text-white px-2 py-0.5 rounded uppercase animate-pulse">
            Mới nhận
          </span>
          <Link
            to={`/article/${hero?.slug}`}
            className="text-sm text-red-900 font-bold truncate hover:underline transition-all"
          >
            {hero?.title || "Đang cập nhật những tin tức nóng hổi nhất..."}
          </Link>
        </div>
      </div>

      <main className="container mx-auto px-4 lg:px-8 py-6 flex-grow">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 pb-8 border-b border-gray-200">
          <div className="lg:col-span-8 group">
            {hero && (
              <Link to={`/article/${hero.slug}`}>
                <div className="relative overflow-hidden rounded-2xl mb-4 shadow-xl">
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}${hero.image_url}`}
                    className="w-full h-[300px] md:h-[520px] object-cover group-hover:scale-105 transition duration-1000"
                    alt={hero.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 md:p-10">
                    <span className="bg-red-700 text-white text-[10px] font-black px-3 py-1 rounded-full mb-4 uppercase tracking-widest inline-block shadow-lg">
                      {hero.category?.name || "Tin nổi bật"}
                    </span>
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold text-white leading-[1.1] mb-4 italic tracking-tighter">
                      {hero.title}
                    </h1>
                    <p className="text-gray-300 text-sm md:text-lg line-clamp-2 max-w-2xl font-medium">
                      {hero.summary}
                    </p>
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* Spotlight Section */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <h3 className="font-black text-red-700 uppercase border-b-2 border-red-700 pb-1 italic tracking-widest text-sm">
              Đáng chú ý
            </h3>
            {spotlight.map((item) => (
              <Link
                key={item.id}
                to={`/article/${item.slug}`}
                className="flex gap-4 group"
              >
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}${item.image_url}`}
                  className="w-24 h-24 object-cover rounded-xl shadow-md group-hover:shadow-red-100 transition-all"
                  alt={item.title}
                />
                <h4 className="font-serif font-bold text-base group-hover:text-red-700 transition-colors duration-300 line-clamp-3 leading-snug">
                  {item.title}
                </h4>
              </Link>
            ))}
          </div>
        </section>

        {/* Latest News & Sidebar */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-9">
            <h2 className="text-2xl font-black font-serif border-l-8 border-red-700 pl-4 mb-10 uppercase italic tracking-tighter">
              Mới cập nhật
            </h2>
            <div className="space-y-10">
              {latest.map((item) => (
                <Link
                  key={item.id}
                  to={`/article/${item.slug}`}
                  className="flex flex-col sm:flex-row gap-6 border-b border-gray-50 pb-10 last:border-0 group"
                >
                  <div className="sm:w-[280px] h-44 overflow-hidden rounded-xl shadow-sm flex-shrink-0">
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}${
                        item.image_url
                      }`}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                      alt={item.title}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] font-black text-red-700 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded">
                        {item.category?.name}
                      </span>
                      <span className="text-gray-400 text-[10px] font-bold flex items-center gap-1 uppercase">
                        <Clock size={12} />
                        {item.created_at_human || "Vừa xong"}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold font-serif mb-3 group-hover:text-red-700 transition-colors leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed font-medium">
                      {item.summary}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <Sidebar marketData={MARKET_DATA} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
