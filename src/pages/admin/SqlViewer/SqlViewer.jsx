import React from "react";
import {
  Construction,
  Wrench,
  Cpu,
  ShieldAlert,
  Terminal as TerminalIcon,
  AlertTriangle,
} from "lucide-react";

const SqlViewer = () => {
  return (
    <div className="p-8 bg-[#0f172a] min-h-[70vh] font-sans text-slate-300 relative overflow-hidden rounded-[3rem] border border-white/5">
      {/* Hiệu ứng Grid Background cho ngầu */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(#2563eb 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      ></div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        {/* Icon Animated */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-blue-500/20 blur-3xl animate-pulse"></div>
          <div className="p-6 bg-slate-800/50 border border-blue-500/30 rounded-[2.5rem] relative">
            <Construction size={64} className="text-blue-500 animate-bounce" />
          </div>
          <div className="absolute -top-2 -right-2 p-2 bg-amber-500 rounded-full text-slate-900 shadow-xl">
            <Wrench size={16} />
          </div>
        </div>

        {/* Text Nội dung */}
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white mb-4">
          Module Under Development
        </h1>

        <p className="text-slate-400 font-bold max-w-md mx-auto leading-relaxed mb-10">
          Tính năng trích xuất dữ liệu SQL bảo mật đang được cấu hình. Vui lòng
          quay lại sau khi hệ thống hoàn tất bảo trì lớp bảo mật.
        </p>

        {/* Status Chips */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 rounded-full border border-slate-700">
            <Cpu size={14} className="text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
              Engine: v2.0-Alpha
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 rounded-full border border-slate-700">
            <ShieldAlert size={14} className="text-rose-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
              Security: Encrypting
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-full border border-amber-500/20">
            <AlertTriangle size={14} className="text-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">
              Progress: 85%
            </span>
          </div>
        </div>

        {/* Fake Terminal Log để quay video cho xịn */}
        <div className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 font-mono text-left text-[11px] shadow-2xl">
          <div className="flex gap-1.5 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
          </div>
          <p className="text-blue-400 italic">
            # Initializing secure backup protocol...
          </p>
          <p className="text-slate-500">
            [SYSTEM] Scanning database structure: OK
          </p>
          <p className="text-slate-500">
            [SYSTEM] Checking encryption keys: PENDING
          </p>
          <p className="text-emerald-400 animate-pulse underline ml-4 mt-1">
            _ Linking to Laragon MySQL bin...
          </p>
        </div>
      </div>
    </div>
  );
};

export default SqlViewer;
