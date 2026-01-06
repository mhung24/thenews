import React from "react";
import { Link } from "react-router-dom";
import { Home, AlertTriangle, ArrowLeft } from "lucide-react";
import Header from "../../reader/Home/components/Header";
import Footer from "../../reader/Home/Footer/Footer";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header currentDate={new Date().toLocaleDateString("vi-VN")} />

      <main className="flex-grow flex items-center justify-center py-20">
        <div className="text-center px-4">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-50 rounded-full mb-8">
            <AlertTriangle size={48} className="text-red-700 animate-bounce" />
          </div>

          <h1 className="text-8xl md:text-9xl font-serif font-black text-gray-100 absolute left-1/2 -translate-x-1/2 -z-10 select-none">
            404
          </h1>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold uppercase italic text-gray-900 tracking-tighter mb-4">
              Trang không tồn tại
            </h2>
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em] italic mb-10 max-w-md mx-auto leading-relaxed">
              Đường dẫn bạn truy cập có thể đã bị xóa hoặc không còn tồn tại
              trên hệ thống VN Daily.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 px-8 py-4 bg-red-700 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest italic shadow-xl shadow-red-100 hover:bg-red-800 transition-all hover:-translate-y-1"
              >
                <Home size={16} /> Về trang chủ
              </Link>
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black uppercase text-[11px] tracking-widest italic hover:bg-gray-200 transition-all"
              >
                <ArrowLeft size={16} /> Quay lại
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
