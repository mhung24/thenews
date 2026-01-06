import React from "react";
import { useLocation, Link } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import { POLICY_CONTENT } from "../../services/PolicyData";
import Header from "./Home/components/Header";
import Footer from "./Home/Footer/Footer";

const PolicyPage = () => {
  const { pathname } = useLocation();
  const data = POLICY_CONTENT[pathname] || { title: "Thông tin", sections: [] };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header currentDate={new Date().toLocaleDateString("vi-VN")} />

      <main className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Nút quay lại */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-red-700 transition-colors mb-10 text-[10px] font-black uppercase tracking-widest italic"
          >
            <ArrowLeft size={14} /> Quay lại trang chủ
          </Link>

          {/* Tiêu đề chính */}
          <header className="mb-12 border-b-4 border-red-700 pb-8">
            <h1 className="text-5xl font-serif font-bold uppercase italic text-gray-900 tracking-tighter leading-none mb-4">
              {data.title}
            </h1>
            {data.lastUpdated && (
              <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest italic">
                <Clock size={12} /> Cập nhật lần cuối: {data.lastUpdated}
              </div>
            )}
          </header>

          {/* Nội dung chi tiết */}
          <div className="space-y-10">
            {data.sections.map((section, index) => (
              <section key={index} className="group">
                <h3 className="text-lg font-black text-gray-900 uppercase italic tracking-tight mb-4 group-hover:text-red-700 transition-colors">
                  {section.heading}
                </h3>
                <p className="text-gray-600 font-medium leading-relaxed whitespace-pre-line border-l-2 border-gray-100 pl-6 group-hover:border-red-200 transition-colors">
                  {section.text}
                </p>
              </section>
            ))}
          </div>

          {/* Chân trang nội dung */}
          <div className="mt-20 p-8 bg-gray-50 rounded-3xl border border-gray-100 text-center">
            <p className="text-sm text-gray-500 font-bold italic">
              Mọi thắc mắc về nội dung này, vui lòng gửi phản hồi về địa chỉ
              <span className="text-red-700 ml-1">feedback@vndaily.vn</span>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PolicyPage;
