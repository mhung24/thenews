import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileCheck,
  Users,
  Settings,
  LogOut,
  ShieldCheck,
  BarChart3,
  FileWarning,
  MessageSquareWarning,
} from "lucide-react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { dashboardService } from "../services/dashboardService";

const ModSidebar = () => {
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);
  const activeTab = location.pathname;

  useEffect(() => {
    const fetchInitialCount = async () => {
      try {
        const res = await dashboardService.getStats();
        setPendingCount(res.data.pending_articles || 0);
      } catch (error) {
        console.error("Lỗi lấy stats:", error);
      }
    };
    fetchInitialCount();
  }, []);

  useEffect(() => {
    window.Pusher = Pusher;
    const echo = new Echo({
      broadcaster: "pusher",
      key: import.meta.env.VITE_PUSHER_APP_KEY,
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
      forceTLS: true,
    });

    // Debug: Kiểm tra xem Frontend đã kết nối thành công tới Pusher Server chưa
    echo.connector.pusher.connection.bind("connected", () => {});

    const channel = echo
      .channel("moderator-notifications")
      .listen(".new-article-submitted", (data) => {
        setPendingCount((prev) => prev + 1);
      });

    return () => {
      channel.stopListening(".new-article-submitted");
      echo.disconnect();
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  };

  const menuGroups = [
    {
      label: "QUẢN LÝ CHUNG",
      items: [
        { id: "/moderator", icon: LayoutDashboard, label: "Tổng quan" },
        { id: "/moderator/statistics", icon: BarChart3, label: "Thống kê" },
      ],
    },
    {
      label: "KIỂM DUYỆT",
      items: [
        {
          id: "/moderator/moderation",
          icon: FileCheck,
          label: "Duyệt bài viết",
        },
        {
          id: "/moderator/reports",
          icon: FileWarning,
          label: "Báo cáo vi phạm",
        },
        {
          id: "/moderator/article",
          icon: MessageSquareWarning,
          label: "Quản lý bài viết",
        },
      ],
    },
    {
      label: "HỆ THỐNG",
      items: [
        { id: "/moderator/users", icon: Users, label: "Quản lý User" },
        { id: "/moderator/settings", icon: Settings, label: "Cấu hình chung" },
      ],
    },
  ];

  return (
    <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800 shadow-xl">
      <div className="p-6 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-700 rounded-xl flex items-center justify-center shadow-lg shadow-rose-900/50">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white leading-none">
              VN<span className="text-rose-500">MOD</span>
            </h1>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Control Panel
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-8">
        {menuGroups.map((group, index) => (
          <div key={index}>
            <h3 className="px-4 mb-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {group.label}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => (
                <Link
                  key={item.id}
                  to={item.id}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                    activeTab === item.id
                      ? "bg-rose-600 text-white shadow-lg shadow-rose-900/40 font-bold"
                      : "hover:bg-slate-800 hover:text-white font-medium"
                  }`}
                >
                  <item.icon
                    size={20}
                    className={
                      activeTab === item.id
                        ? "text-white"
                        : "text-slate-500 group-hover:text-rose-400"
                    }
                  />
                  <span>{item.label}</span>
                  {item.label === "Duyệt bài viết" && pendingCount > 0 && (
                    <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md animate-pulse">
                      {pendingCount}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-rose-900/20 hover:text-rose-500 font-bold text-sm transition-all border border-transparent hover:border-rose-900/30"
        >
          <LogOut size={20} />
          <span>Đăng xuất hệ thống</span>
        </button>
      </div>
    </aside>
  );
};

export default ModSidebar;
