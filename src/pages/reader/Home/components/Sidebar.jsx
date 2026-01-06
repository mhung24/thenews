import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";

const Sidebar = ({ marketData }) => {
  const [mostRead, setMostRead] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMostRead = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/articles/popular`
        );
        setMostRead(res.data.data || []);
      } catch (error) {
        console.error("Lỗi lấy tin đọc nhiều:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMostRead();
  }, []);

  return (
    <aside className="lg:col-span-3">
      {/* Container dùng Sticky - Cách top một khoảng để không dính sát Header */}
      <div className="sticky top-24 space-y-8">
        {/* 1. CHỈ SỐ THỊ TRƯỜNG - Card gọn nhẹ với Badges màu sắc */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <h4 className="font-black text-slate-900 text-[10px] uppercase mb-4 flex items-center gap-2 italic tracking-[0.1em]">
            <TrendingUp size={14} className="text-red-700" /> THỊ TRƯỜNG 24H
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {marketData.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-colors group"
              >
                <span className="text-[11px] font-medium text-slate-500 group-hover:text-slate-900 transition-colors">
                  {item.name}
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-black text-sm text-slate-900 tracking-tighter">
                    {item.value}
                  </span>
                  <span
                    className={`min-w-[60px] text-center px-2 py-1 rounded-lg text-[10px] font-black flex items-center justify-center gap-0.5 shadow-sm transition-transform group-hover:scale-105 ${
                      item.isUp
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {item.isUp ? (
                      <ArrowUpRight size={10} />
                    ) : (
                      <ArrowDownRight size={10} />
                    )}
                    {item.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. KHỐI QUẢNG CÁO - Tỉ lệ 300x600 Visual-heavy */}
        <div className="group relative w-full aspect-[1/2] overflow-hidden rounded-2xl border border-slate-100 shadow-lg cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=400&h=800&auto=format&fit=crop"
            alt="Ads"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="absolute bottom-6 left-0 right-0 px-6 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <p className="text-[10px] font-black text-white/90 uppercase tracking-widest mb-2 italic">
              Trải nghiệm không quảng cáo
            </p>
            <button className="w-full py-3 bg-red-700 text-white text-[11px] font-black uppercase rounded-xl shadow-xl hover:bg-red-800 transition-colors">
              Đăng ký Premium
            </button>
          </div>

          <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-md text-[8px] text-white/70 px-2 py-0.5 rounded border border-white/10 font-black tracking-widest uppercase">
            Quảng cáo
          </div>
        </div>

        {/* 3. ĐỌC NHIỀU 24H - Bảng xếp hạng có ảnh & số thứ tự lớn */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-serif font-black text-xl text-slate-900 mb-6 flex items-center gap-3 italic">
            <span className="w-1.5 h-6 bg-red-700 rounded-full"></span> ĐỌC
            NHIỀU
          </h3>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-red-700" />
            </div>
          ) : (
            <div className="space-y-7">
              {mostRead.map((item, index) => (
                <Link
                  key={item.id}
                  to={`/article/${item.slug}`}
                  className="flex gap-4 group cursor-pointer relative"
                >
                  <div className="relative z-10 flex gap-4 w-full">
                    <div className="flex-shrink-0 flex items-start pt-1">
                      <span className="text-3xl font-serif font-black text-slate-100 group-hover:text-red-700 transition-colors duration-300 italic">
                        {index + 1}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-black text-red-700 uppercase italic tracking-wider">
                        {item.category?.name}
                      </span>
                      <h4 className="text-[13px] font-bold text-slate-800 leading-snug group-hover:text-red-700 transition line-clamp-2 mt-1 italic">
                        {item.title}
                      </h4>
                    </div>

                    <div className="w-14 h-14 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100 shadow-sm bg-slate-50">
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}${
                          item.image_url
                        }`}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => (e.target.src = "/placeholder.jpg")}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
