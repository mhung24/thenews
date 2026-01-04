import React, { useState } from "react";
import {
  Settings,
  Shield,
  Database,
  Mail,
  Key,
  Activity,
  Save,
  RefreshCcw,
  AlertTriangle,
  Server,
  Code,
  Eye,
  EyeOff,
  Loader2,
  Globe,
  Bell,
  Zap,
} from "lucide-react";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [showApiKey, setShowApiKey] = useState(false);
  const [loading, setLoading] = useState(false);

  const tabs = [
    {
      id: "general",
      label: "Chung",
      icon: <Settings size={18} />,
      color: "text-blue-500",
    },
    {
      id: "email",
      label: "Email",
      icon: <Mail size={18} />,
      color: "text-rose-500",
    },
    {
      id: "api",
      label: "Kết nối",
      icon: <Zap size={18} />,
      color: "text-amber-500",
    },
    {
      id: "maintenance",
      label: "Hệ thống",
      icon: <Activity size={18} />,
      color: "text-emerald-500",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                    <Globe size={16} />
                  </div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Thông tin website
                  </label>
                </div>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Tên hệ thống"
                    className="w-full px-0 py-2 bg-transparent border-b border-slate-200 outline-none focus:border-blue-500 font-bold text-slate-700 transition-all placeholder:text-slate-300"
                  />
                  <input
                    type="text"
                    placeholder="URL Trang chủ"
                    className="w-full px-0 py-2 bg-transparent border-b border-slate-200 outline-none focus:border-blue-500 font-bold text-slate-700 transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="group p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
                    <Shield size={16} />
                  </div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Liên hệ & Múi giờ
                  </label>
                </div>
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="Email quản trị"
                    className="w-full px-0 py-2 bg-transparent border-b border-slate-200 outline-none focus:border-rose-500 font-bold text-slate-700 transition-all placeholder:text-slate-300"
                  />
                  <select className="w-full px-0 py-2 bg-transparent border-b border-slate-200 outline-none focus:border-rose-500 font-bold text-slate-700 appearance-none cursor-pointer">
                    <option>(UTC+07:00) Vietnam</option>
                    <option>(UTC+00:00) London</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl shadow-slate-300">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                  <Bell className="text-amber-400" />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-widest">
                    Trạng thái vận hành
                  </h4>
                  <p className="text-xs text-slate-400 font-bold mt-1">
                    Version 4.0.2 Stable • Health: 100%
                  </p>
                </div>
              </div>
              <div className="flex items-center px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-ping"></span>{" "}
                Online
              </div>
            </div>
          </div>
        );

      case "email":
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white rounded-2xl shadow-sm text-rose-500">
                    <Server size={20} />
                  </div>
                  <h4 className="font-black uppercase text-xs tracking-widest text-slate-400">
                    SMTP Gateway
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <input
                    type="text"
                    placeholder="Host"
                    className="bg-transparent border-b py-2 outline-none font-bold focus:border-rose-500"
                  />
                  <input
                    type="text"
                    placeholder="Port"
                    className="bg-transparent border-b py-2 outline-none font-bold focus:border-rose-500"
                  />
                  <input
                    type="text"
                    placeholder="User"
                    className="bg-transparent border-b py-2 outline-none font-bold focus:border-rose-500"
                  />
                  <input
                    type="password"
                    placeholder="Pass"
                    className="bg-transparent border-b py-2 outline-none font-bold focus:border-rose-500"
                  />
                </div>
              </div>
              <div className="p-10 bg-rose-600 rounded-[2.5rem] text-white flex flex-col justify-between shadow-xl shadow-rose-200">
                <Mail size={40} className="opacity-20" />
                <div>
                  <h5 className="font-black text-sm uppercase">Kiểm tra</h5>
                  <p className="text-[10px] font-bold opacity-60 mt-2">
                    Gửi email test để xác nhận cấu hình hoạt động.
                  </p>
                  <button className="mt-6 w-full py-4 bg-white text-rose-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                    Test SMTP
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "api":
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="p-12 bg-slate-900 rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] group-hover:bg-amber-500/20 transition-all"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <Key className="text-amber-500" size={24} />
                  <span className="text-white font-black uppercase text-xs tracking-[0.2em]">
                    Private API Key
                  </span>
                </div>
                <div className="flex items-center justify-between bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
                  <code className="text-amber-400 font-mono text-lg truncate pr-10">
                    {showApiKey
                      ? "api_2026_live_full_access_dashboard_demo"
                      : "********************************"}
                  </code>
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="p-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
                  >
                    {showApiKey ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "maintenance":
        return (
          <div className="p-12 bg-white border border-slate-100 rounded-[3rem] shadow-sm flex flex-col md:flex-row items-center gap-10 animate-in zoom-in-95 duration-500">
            <div className="w-32 h-32 bg-rose-50 rounded-[2.5rem] flex items-center justify-center text-rose-500">
              <AlertTriangle size={48} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                Bảo trì hệ thống
              </h4>
              <p className="text-slate-400 font-bold mt-2 leading-relaxed">
                Khi kích hoạt, website sẽ hiển thị trang thông báo bảo trì cho
                khách truy cập.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                <button className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200">
                  Kích hoạt ngay
                </button>
                <button className="px-10 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200">
                  Dọn dẹp Cache
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      {/* Page Title & Save Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
            Settings
          </h1>
          <div className="h-1.5 w-20 bg-blue-600 mt-2 rounded-full"></div>
        </div>

        <button
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 1200);
          }}
          className="group flex items-center gap-4 px-12 py-5 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.25em] rounded-[1.5rem] hover:bg-blue-600 transition-all shadow-2xl shadow-slate-300 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Save
              size={18}
              className="group-hover:scale-125 transition-transform"
            />
          )}
          Save Configuration
        </button>
      </div>

      {/* Modern Tabs Bar */}
      <div className="flex p-2 bg-slate-100/50 rounded-[2.5rem] border border-slate-100 gap-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-10 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id
                ? "bg-white text-slate-900 shadow-xl shadow-slate-200/50 scale-105"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <span
              className={activeTab === tab.id ? tab.color : "text-slate-300"}
            >
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Canvas */}
      <div className="relative p-1 bg-white rounded-[4rem] shadow-sm border border-slate-100">
        <div className="p-16">{renderContent()}</div>
      </div>

      {/* Minimal Footer Info */}
      <div className="flex justify-between items-center px-10 opacity-30 italic">
        <span className="text-[9px] font-black uppercase tracking-[0.4em]">
          System Admin v4.0.2
        </span>
        <div className="flex gap-6">
          <Code size={14} /> <Database size={14} /> <Server size={14} />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
