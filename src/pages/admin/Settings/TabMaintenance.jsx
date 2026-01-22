import React from "react";
import {
  AlertTriangle,
  ShieldAlert,
  Database,
  ChevronRight,
} from "lucide-react";

const TabMaintenance = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Cấu hình Bảo trì hệ thống */}
      <div className="p-12 bg-white border-2 border-slate-50 rounded-[3.5rem] shadow-sm flex flex-col md:flex-row items-center gap-12">
        <div className="w-40 h-40 bg-rose-50 rounded-[3rem] flex items-center justify-center text-rose-500 relative shrink-0">
          <div className="absolute inset-0 bg-rose-500/10 animate-ping rounded-[3rem]"></div>
          <AlertTriangle size={64} className="relative z-10" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h4 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
            System Maintenance
          </h4>
          <p className="text-slate-400 font-bold mt-3 leading-relaxed text-sm">
            Tạm thời đóng cửa Website với độc giả để bảo trì toàn diện hệ thống.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center md:justify-start">
            <button className="px-10 py-5 bg-rose-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-rose-100 hover:bg-rose-700 transition-all flex items-center gap-3">
              <ShieldAlert size={18} /> Kích hoạt Bảo trì
            </button>
          </div>
        </div>
      </div>

      {/* Cấu hình Sao lưu dữ liệu */}
      <div className="p-10 bg-slate-900 rounded-[3.5rem] flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-amber-500/10 rounded-[2rem] flex items-center justify-center text-amber-500 border border-amber-500/20">
            <Database size={32} />
          </div>
          <div>
            <h5 className="text-white font-black uppercase text-lg italic tracking-tight">
              Data Archiving
            </h5>
            <p className="text-slate-500 font-bold text-xs mt-1">
              Lưu trữ và đóng gói dữ liệu hệ thống định kỳ.
            </p>
          </div>
        </div>

        <button
          className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 group opacity-50 cursor-not-allowed"
          disabled
        >
          Đang phát triển
          <ChevronRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </div>
  );
};

export default TabMaintenance;
