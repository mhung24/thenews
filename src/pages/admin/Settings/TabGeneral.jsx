import React from "react";
import { Globe, Shield, Bell } from "lucide-react";

const TabGeneral = () => (
  <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Box 1 */}
      <div className="group p-8 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
            <Globe size={20} />
          </div>
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Thông tin Website
          </label>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">
              Tên hệ thống
            </span>
            <input
              type="text"
              className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-slate-700 transition-all"
              placeholder="VN Daily News"
            />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">
              URL Trang chủ
            </span>
            <input
              type="text"
              className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-slate-700 transition-all"
              placeholder="https://vndaily.site"
            />
          </div>
        </div>
      </div>

      {/* Box 2 */}
      <div className="group p-8 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
            <Shield size={20} />
          </div>
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Bảo mật & Thời gian
          </label>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">
              Email quản trị
            </span>
            <input
              type="email"
              className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-rose-500/20 font-bold text-slate-700 transition-all"
              placeholder="admin@vndaily.site"
            />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">
              Múi giờ hệ thống
            </span>
            <select className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-rose-500/20 font-bold text-slate-700 cursor-pointer">
              <option>(UTC+07:00) Vietnam</option>
              <option>(UTC+00:00) London</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TabGeneral;
