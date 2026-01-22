import React, { useState } from "react";
import { Key, Eye, EyeOff, Zap, RefreshCcw } from "lucide-react";

const TabApi = () => {
  const [showKey, setShowKey] = useState(false);
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="p-12 bg-slate-900 rounded-[3rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-[120px] group-hover:bg-amber-500/20 transition-all"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-500">
              <Zap size={24} />
            </div>
            <div>
              <h4 className="text-white font-black uppercase text-xs tracking-widest">
                Private Access Token
              </h4>
              <p className="text-slate-500 text-[10px] font-bold mt-1">
                Dùng để kết nối ứng dụng mobile hoặc tool bên thứ 3
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-2 rounded-[2rem] backdrop-blur-xl">
            <div className="flex-1 px-6">
              <code className="text-amber-400 font-mono text-lg tracking-wider">
                {showKey
                  ? "vndaily_live_99x88_secret_token_2026"
                  : "••••••••••••••••••••••••••••••••"}
              </code>
            </div>
            <button
              onClick={() => setShowKey(!showKey)}
              className="p-5 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all"
            >
              {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <button className="p-5 bg-amber-500 text-slate-900 rounded-full hover:scale-110 transition-all">
              <RefreshCcw size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabApi;
