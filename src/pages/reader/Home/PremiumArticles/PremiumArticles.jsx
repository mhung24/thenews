import React from "react";
import { Link } from "react-router-dom";
import {
  Crown,
  Rocket,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Star,
  ArrowRight,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../Footer/Footer";

export default function PremiumArticles() {
  return (
    <div className="min-h-screen bg-[#fcfcf9] text-slate-900 font-sans flex flex-col">
      <Header
        currentDate={new Date().toLocaleDateString("vi-VN")}
        setIsMobileMenuOpen={() => {}}
      />

      <main className="flex-grow flex items-center justify-center relative overflow-hidden py-24">
        <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-100 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-50 rounded-full blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-yellow-200 px-5 py-2 rounded-full mb-10 shadow-sm transition-transform hover:scale-105">
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-yellow-600">
              VNDaily Special
            </span>
          </div>

          <div className="mb-12">
            <h1 className="text-6xl md:text-9xl font-serif font-black uppercase italic tracking-tighter text-slate-900 mb-6 relative inline-block">
              Premium
              <span className="absolute -top-4 -right-8">
                <Crown size={40} className="text-yellow-500 rotate-12" />
              </span>
            </h1>

            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="h-[1px] w-12 bg-slate-200"></div>
              <h2 className="text-2xl md:text-4xl font-bold text-red-700 uppercase italic tracking-[0.2em]">
                Đang phát triển
              </h2>
              <div className="h-[1px] w-12 bg-slate-200"></div>
            </div>
          </div>

          <p className="text-slate-500 max-w-2xl mx-auto mb-16 text-lg leading-relaxed font-medium italic">
            Chúng tôi đang tinh tuyển những nội dung chất lượng nhất, những bài
            phân tích sâu sắc từ các chuyên gia hàng đầu để sớm gửi tới độc giả
            Premium.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              to="/"
              className="group flex items-center gap-3 px-10 py-5 bg-slate-900 text-white font-black uppercase text-[11px] tracking-widest rounded-full hover:bg-red-700 transition-all shadow-2xl shadow-slate-200"
            >
              <ChevronLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Quay lại trang chủ
            </Link>

            <div className="flex items-center gap-3 text-slate-600 border border-slate-200 px-8 py-5 rounded-full bg-white shadow-sm font-bold text-[11px] uppercase tracking-widest">
              <Rocket size={18} className="text-red-600 animate-bounce" />
              Sắp ra mắt trong năm 2026
            </div>
          </div>

          <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-12 max-w-5xl mx-auto border-t border-slate-100 pt-16">
            <div className="flex flex-col items-center gap-4 group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-50 group-hover:border-yellow-400 transition-all">
                <ShieldCheck
                  size={28}
                  className="text-slate-400 group-hover:text-yellow-600"
                />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900">
                Bảo mật VIP
              </span>
            </div>
            <div className="flex flex-col items-center gap-4 group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-50 group-hover:border-yellow-400 transition-all">
                <Sparkles
                  size={28}
                  className="text-slate-400 group-hover:text-yellow-600"
                />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900">
                Trải nghiệm sạch
              </span>
            </div>
            <div className="flex flex-col items-center gap-4 group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-50 group-hover:border-yellow-400 transition-all">
                <Star
                  size={28}
                  className="text-slate-400 group-hover:text-yellow-600"
                />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900">
                Tin độc quyền
              </span>
            </div>
            <div className="flex flex-col items-center gap-4 group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-50 group-hover:border-yellow-400 transition-all">
                <ArrowRight
                  size={28}
                  className="text-slate-400 group-hover:text-yellow-600"
                />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900">
                Đọc không giới hạn
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
