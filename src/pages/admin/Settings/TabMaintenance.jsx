import React, { useState } from "react";
import {
  AlertTriangle,
  Trash2,
  ShieldAlert,
  Database,
  ChevronRight,
  X,
} from "lucide-react";
// import SqlViewer from "../SqlViewer/SqlViewer";

const TabMaintenance = () => {
  const [showSqlViewer, setShowSqlViewer] = useState(false);

  if (showSqlViewer) {
    return (
      <div className="relative animate-in slide-in-from-right duration-500">
        <button
          onClick={() => setShowSqlViewer(false)}
          className="absolute -top-12 right-0 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-700 transition-all"
        >
          <X size={16} /> Đóng trình xem SQL
        </button>
        {/* <SqlViewer /> */}
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
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
            Tạm thời đóng cửa Website với độc giả để bảo trì.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center md:justify-start">
            <button className="px-10 py-5 bg-rose-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-rose-100 hover:bg-rose-700 transition-all flex items-center gap-3">
              <ShieldAlert size={18} /> Kích hoạt Bảo trì
            </button>
          </div>
        </div>
      </div>

      <div className="p-10 bg-slate-900 rounded-[3.5rem] flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-amber-500/10 rounded-[2rem] flex items-center justify-center text-amber-500 border border-amber-500/20">
            <Database size={32} />
          </div>
          <div>
            <h5 className="text-white font-black uppercase text-lg italic tracking-tight">
              Database Snapshot
            </h5>
            <p className="text-slate-500 font-bold text-xs mt-1">
              Xuất cấu trúc và dữ liệu SQL hiện tại.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowSqlViewer(true)}
          className="px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 group"
        >
          Mở trình xem SQL{" "}
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
