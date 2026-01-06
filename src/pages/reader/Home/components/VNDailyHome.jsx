import React, { useState, useEffect } from "react";
import axios from "axios";
import { Clock, PlayCircle, Video, Loader2 } from "lucide-react";
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
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };
    setCurrentDate(
      now.toLocaleDateString("vi-VN", options).charAt(0).toUpperCase() +
        now.toLocaleDateString("vi-VN", options).slice(1)
    );

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/articles?status=published&limit=20`
        );
        setArticles(res.data.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-red-700" size={40} />
      </div>
    );

  const hero = articles[0];
  const spotlight = articles.slice(1, 4);
  const latest = [...articles].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <div className="bg-white min-h-screen font-sans text-gray-800 flex flex-col">
      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        currentDate={currentDate}
      />

      <div className="bg-red-50 border-b border-red-100 py-2">
        <div className="container mx-auto px-4 lg:px-8 flex items-center gap-3">
          <span className="text-xs font-bold bg-red-700 text-white px-2 py-0.5 rounded uppercase animate-pulse">
            Mới nhận
          </span>
          <p className="text-sm text-red-900 font-medium truncate">
            Cập nhật: {articles[0]?.title}
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 lg:px-8 py-6 flex-grow">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 pb-8 border-b border-gray-200">
          <div className="lg:col-span-8 group cursor-pointer">
            {hero && (
              <div
                onClick={() => (window.location.href = `/article/${hero.slug}`)}
              >
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}${hero.image_url}`}
                    className="w-full h-[300px] md:h-[480px] object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 md:p-8">
                    <span className="bg-red-700 text-white text-xs font-bold px-2 py-1 rounded mb-3 uppercase tracking-wider inline-block">
                      Tiêu điểm
                    </span>
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight mb-3">
                      {hero.title}
                    </h1>
                    <p className="text-gray-200 text-sm md:text-lg line-clamp-2">
                      {hero.summary}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <h3 className="font-bold text-red-700 uppercase border-b-2 border-red-700 pb-1">
              Đáng chú ý
            </h3>
            {spotlight.map((item) => (
              <article
                key={item.id}
                className="flex gap-4 group cursor-pointer"
                onClick={() => (window.location.href = `/article/${item.slug}`)}
              >
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}${item.image_url}`}
                  className="w-24 h-24 object-cover rounded"
                />
                <h4 className="font-serif font-bold text-base group-hover:text-red-700 transition line-clamp-3">
                  {item.title}
                </h4>
              </article>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-9">
            <h2 className="text-2xl font-bold font-serif border-l-4 border-red-700 pl-3 mb-6">
              Mới cập nhật
            </h2>
            <div className="space-y-8">
              {latest.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-5 border-b border-gray-100 pb-8 last:border-0 cursor-pointer"
                  onClick={() =>
                    (window.location.href = `/article/${item.slug}`)
                  }
                >
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}${item.image_url}`}
                    className="sm:w-[260px] h-40 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-red-700 uppercase">
                        {item.category?.name}
                      </span>
                      <span className="text-gray-400 text-[10px] flex items-center gap-1">
                        <Clock size={12} />{" "}
                        {item.created_at_human || "Vừa xong"}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold font-serif mb-2 hover:text-red-700 transition">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {item.summary}
                    </p>
                  </div>
                </article>
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
