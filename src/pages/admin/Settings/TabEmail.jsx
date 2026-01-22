import React from "react";
import { Server, Mail, RefreshCcw } from "lucide-react";

const TabEmail = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in duration-500">
    <div className="md:col-span-2 p-12 bg-slate-50 rounded-[3rem] border border-slate-100 space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white rounded-2xl shadow-sm text-rose-500">
          <Server size={24} />
        </div>
        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400">
          SMTP Server Configuration
        </h4>
      </div>
      <div className="grid grid-cols-2 gap-x-10 gap-y-8">
        {["Host", "Port", "Username", "Password"].map((field) => (
          <div key={field} className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
              {field}
            </label>
            <input
              type={field === "Password" ? "password" : "text"}
              className="w-full bg-transparent border-b border-slate-200 py-2 outline-none font-bold focus:border-rose-500 transition-all"
              placeholder={`Nhập ${field}...`}
            />
          </div>
        ))}
      </div>
    </div>

    <div className="p-10 bg-rose-600 rounded-[3rem] text-white flex flex-col justify-between shadow-2xl shadow-rose-200">
      <Mail size={48} className="opacity-20" />
      <div>
        <h5 className="font-black text-lg uppercase leading-tight italic">
          Test Connection
        </h5>
        <p className="text-xs font-bold opacity-70 mt-3 leading-relaxed">
          Đảm bảo cấu hình SMTP chính xác để hệ thống có thể gửi email thông báo
          và lấy lại mật khẩu.
        </p>
        <button className="mt-8 w-full py-5 bg-white text-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
          Gửi Email Test
        </button>
      </div>
    </div>
  </div>
);

export default TabEmail;
