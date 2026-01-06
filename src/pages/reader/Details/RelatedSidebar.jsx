import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Clock } from "lucide-react";

const RelatedSidebar = ({ relatedArticles }) => {
  return (
    <aside className="lg:col-span-3 space-y-12">
      <div className="sticky top-24">
        <h3 className="text-[11px] font-black text-red-700 uppercase tracking-[0.3em] border-b-4 border-red-700 pb-3 mb-8 italic">
          LIÊN QUAN
        </h3>
        <div className="space-y-6">
          {relatedArticles.length > 0 ? (
            relatedArticles.map((related) => (
              <RouterLink
                key={related.id}
                to={`/article/${related.slug}`}
                className="group flex gap-4 border-b border-gray-50 pb-6 last:border-none last:pb-0"
              >
                {/* Hình ảnh Thumbnail tập trung vào visual */}
                <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}${
                      related.image_url
                    }`}
                    alt={related.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => (e.target.src = "/placeholder.jpg")}
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <h4 className="font-bold text-[13px] leading-snug group-hover:text-red-700 transition-all duration-300 uppercase italic tracking-tighter line-clamp-3 font-serif">
                    {related.title}
                  </h4>
                  <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-2 flex items-center gap-2 italic">
                    <Clock size={12} className="text-red-700/50" />
                    {new Date(related.created_at).toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </RouterLink>
            ))
          ) : (
            <div className="py-10 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-[10px] text-gray-400 italic font-black uppercase tracking-widest">
                Chưa có tin liên quan
              </p>
            </div>
          )}
        </div>
        <div className="mt-12 space-y-8">
          <div className="bg-slate-900 rounded-[2rem] p-8 border border-slate-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-700/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-red-700/20 transition-colors"></div>
            <h3 className="text-white font-serif font-bold text-xl mb-3 relative z-10 italic">
              Đừng bỏ lỡ dòng chảy tin tức.
            </h3>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-6 leading-relaxed italic relative z-10">
              Nhận những phân tích chuyên sâu nhất từ VN Daily mỗi sáng.
            </p>
            <div className="relative z-10 space-y-3">
              <input
                type="email"
                placeholder="EMAIL CỦA BẠN..."
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-xs outline-none focus:border-red-700 transition font-bold italic"
              />
              <button className="w-full bg-red-700 hover:bg-red-800 text-white font-black py-3 rounded-xl transition shadow-lg shadow-red-900/20 text-[11px] uppercase italic tracking-widest">
                Đăng ký ngay
              </button>
            </div>
            <p className="text-[9px] text-slate-500 mt-4 text-center font-bold uppercase italic tracking-tighter">
              * Cam kết không gửi thư rác
            </p>
          </div>
          <div className="group cursor-pointer">
            <div className="bg-gray-50 rounded-[2rem] overflow-hidden border border-gray-100 transition-all hover:shadow-xl">
              <div className="relative aspect-[3/4] bg-gray-200 flex flex-col items-center justify-center p-6 text-center">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <div className="w-full h-full bg-slate-200 animate-pulse absolute inset-0"></div>
                <div className="relative z-20 mt-auto">
                  <span className="inline-block bg-white/20 backdrop-blur-md text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] mb-3 italic">
                    Sponsored
                  </span>
                  <h4 className="text-white font-bold text-sm uppercase italic leading-tight mb-4">
                    Trải nghiệm VN Daily Premium không quảng cáo ngay hôm nay
                  </h4>
                  <button className="bg-white text-slate-900 text-[10px] font-black px-6 py-2 rounded-full uppercase italic hover:bg-red-700 hover:text-white transition-colors">
                    Tìm hiểu thêm
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-2 text-[9px] text-gray-300 font-black uppercase tracking-[0.4em] text-center italic">
              Advertisement
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RelatedSidebar;
