import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-white pt-20 pb-10 border-t-4 border-red-700 mt-20 font-sans">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-2">
            <Link
              to="/"
              className="flex items-center gap-2 mb-8 group cursor-pointer"
            >
              <div className="bg-red-700 text-white font-serif font-bold text-3xl px-2.5 py-0.5 rounded-sm shadow-lg">
                V
              </div>
              <span className="font-serif font-bold text-3xl tracking-tight uppercase italic text-white">
                VN Daily
              </span>
            </Link>
            <p className="text-gray-400 text-sm max-w-sm mb-10 leading-relaxed font-medium italic">
              Trang tin tức hàng đầu Việt Nam, cập nhật liên tục 24/7 về mọi mặt
              của đời sống kinh tế xã hội.
            </p>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-800/50 flex items-center justify-center hover:bg-[#1877F2] transition-all cursor-pointer border border-gray-700/50 shadow-lg group">
                <Facebook
                  size={20}
                  className="text-gray-400 group-hover:text-white transition-colors"
                />
              </div>

              <div className="w-12 h-12 rounded-xl bg-gray-800/50 flex items-center justify-center hover:bg-[#1DA1F2] transition-all cursor-pointer border border-gray-700/50 shadow-lg group">
                <Twitter
                  size={20}
                  className="text-gray-400 group-hover:text-white transition-colors"
                />
              </div>

              <div className="w-12 h-12 rounded-xl bg-gray-800/50 flex items-center justify-center hover:bg-[#E4405F] transition-all cursor-pointer border border-gray-700/50 shadow-lg group">
                <Instagram
                  size={20}
                  className="text-gray-400 group-hover:text-white transition-colors"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-black mb-8 text-red-500 uppercase tracking-[0.2em] text-[11px] italic">
              CHUYÊN MỤC
            </h4>
            <ul className="space-y-4 text-sm text-gray-400 font-bold uppercase italic tracking-tighter">
              <li>
                <Link
                  to="/category/thoi-su"
                  className="hover:text-white transition block"
                >
                  Thời sự
                </Link>
              </li>
              <li>
                <Link
                  to="/category/kinh-doanh"
                  className="hover:text-white transition block"
                >
                  Kinh doanh
                </Link>
              </li>
              <li>
                <Link
                  to="/category/the-gioi"
                  className="hover:text-white transition block"
                >
                  Thế giới
                </Link>
              </li>
              <li>
                <Link
                  to="/category/giai-tri"
                  className="hover:text-white transition block"
                >
                  Giải trí
                </Link>
              </li>
              <li>
                <Link
                  to="/category/the-thao"
                  className="hover:text-white transition block"
                >
                  Thể thao
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-black mb-8 text-red-600 uppercase tracking-[0.2em] text-[11px] italic">
              HỖ TRỢ
            </h4>
            <ul className="space-y-5 text-[13px] text-slate-300 font-bold uppercase italic tracking-tighter">
              <li>
                <Link
                  to="/contact-ads"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  Liên hệ quảng cáo
                </Link>
              </li>
              <li>
                <Link
                  to="/recruitment"
                  className="hover:text-white transition-colors"
                >
                  Tuyển dụng
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-white transition-colors"
                >
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Bảo mật thông tin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800/50 pt-10 text-center">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] italic">
            © 2026 VN Daily News. Phát triển bởi VN Daily Media Group.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
