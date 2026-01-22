import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";

const Footer = () => {
  const categories = [
    { name: "Thời sự", slug: "thoi-su" },
    { name: "Kinh doanh", slug: "kinh-doanh" },
    { name: "Thế giới", slug: "the-gioi" },
    { name: "Giải trí", slug: "giai-tri" },
    { name: "Thể thao", slug: "the-thao" },
    { name: "Công nghệ", slug: "cong-nghe" },
  ];

  return (
    <footer className="bg-[#0f172a] text-white pt-20 pb-6 border-t-8 border-red-700 mt-20 font-sans relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-900/10 rounded-full blur-3xl -mr-48 -mt-48"></div>

      <div className="container mx-auto px-4 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-4">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="bg-red-700 text-white font-serif font-bold text-4xl px-3 py-1 rounded-sm shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] group-hover:bg-red-600 transition-colors">
                V
              </div>
              <span className="font-serif font-black text-3xl tracking-tighter uppercase italic text-white">
                VN Daily
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 pr-10 font-medium">
              Cơ quan ngôn luận điện tử cập nhật tin tức đa chiều, chính xác và
              nhanh chóng nhất. Mang đến dòng chảy thông tin không ngừng nghỉ về
              nhịp sống Việt Nam và Thế giới.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Facebook, color: "#1877F2" },
                { Icon: Instagram, color: "#E4405F" },
                { Icon: Youtube, color: "#FF0000" },
              ].map((social, idx) => (
                <div
                  key={idx}
                  className="w-10 h-10 rounded-lg bg-gray-800/80 flex items-center justify-center hover:scale-110 transition-all cursor-pointer border border-gray-700 hover:border-red-500 group"
                >
                  <social.Icon
                    size={18}
                    className="text-gray-400 group-hover:text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Cột 2: Chuyên mục (Sử dụng Grid nội bộ) */}
          <div className="md:col-span-4">
            <h4 className="font-black mb-8 text-white uppercase tracking-widest text-xs flex items-center gap-2">
              <span className="w-8 h-[2px] bg-red-600"></span> CHUYÊN MỤC
            </h4>
            <ul className="grid grid-cols-2 gap-y-4 gap-x-4 text-[13px] text-gray-400 font-bold uppercase italic tracking-tighter">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="hover:text-red-500 transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight
                      size={12}
                      className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-red-500"
                    />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3: Liên hệ thực tế (Tăng độ tin cậy) */}
          <div className="md:col-span-4">
            <h4 className="font-black mb-8 text-white uppercase tracking-widest text-xs flex items-center gap-2">
              <span className="w-8 h-[2px] bg-red-600"></span> LIÊN HỆ TÒA SOẠN
            </h4>
            <div className="space-y-4 text-sm text-gray-400">
              <div className="flex items-start gap-3 group">
                <MapPin size={18} className="text-red-600 shrink-0" />
                <span className="group-hover:text-gray-200 transition-colors">
                  Tòa nhà Daily Tower, Số 1 Liễu Giai, Ba Đình, Hà Nội.
                </span>
              </div>
              <div className="flex items-center gap-3 group">
                <Phone size={18} className="text-red-600 shrink-0" />
                <span className="group-hover:text-gray-200 transition-colors">
                  Hotline: 1900 6789 (24/7)
                </span>
              </div>
              <div className="flex items-center gap-3 group">
                <Mail size={18} className="text-red-600 shrink-0" />
                <span className="group-hover:text-gray-200 transition-colors">
                  contact@vndaily.site
                </span>
              </div>
              <div className="pt-4">
                <Link
                  to="/contact-ads"
                  className="inline-flex items-center gap-2 bg-red-700/10 border border-red-700/50 px-4 py-2 rounded-full text-red-500 text-xs font-black uppercase tracking-widest hover:bg-red-700 hover:text-white transition-all"
                >
                  Hợp tác quảng cáo <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Dòng cuối: Pháp lý & Bản quyền */}
        <div className="border-t border-gray-800 pt-8 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-[10px] text-gray-500 font-medium leading-loose max-w-2xl text-center md:text-left">
              <p className="font-bold text-gray-400 uppercase mb-1">
                © 2026 VN DAILY NEWS - GIẤY PHÉP SỐ 123/GP-BTTTT
              </p>
              <p>
                Chịu trách nhiệm nội dung: Ông Nguyễn Hùng. Ghi rõ nguồn "VN
                Daily" khi phát hành lại thông tin từ website này.
              </p>
            </div>
            <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-gray-500 italic">
              <Link to="/terms" className="hover:text-white">
                Điều khoản
              </Link>
              <Link to="/privacy" className="hover:text-white">
                Bảo mật
              </Link>
              <Link to="/sitemap" className="hover:text-white">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
