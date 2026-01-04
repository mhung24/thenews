import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import { useNotifications } from "../hooks/useNotifications";
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  AlertCircle,
  CheckCircle2,
  Moon,
  Sun,
} from "lucide-react";

const AdminLayout = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navigate = useNavigate();
  const { notifications, markAsRead } = useNotifications();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();

    navigate("/login");
  };
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col h-screen">
        <header className="flex justify-between items-center px-10 py-6 sticky top-0 bg-[#fcfdfe]/80 backdrop-blur-md z-40">
          <h2 className="text-2xl font-black tracking-tight text-slate-800">
            VN Daily CMS
          </h2>

          <div className="flex items-center gap-6">
            {/* <div className="relative group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors"
                size={16}
              />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleSearch}
                className="bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-2.5 text-sm outline-none w-64 focus:ring-4 focus:ring-red-50 focus:border-red-200 transition-all"
              />
            </div> */}

            <div
              className="relative py-2"
              onMouseEnter={() => setShowNotifications(true)}
              onMouseLeave={() => setShowNotifications(false)}
            >
              <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 relative hover:text-red-600 hover:shadow-lg transition-all active:scale-95">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
                )}
              </button>

              <div
                className={`absolute right-0 mt-2 w-80 bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden transition-all duration-300 transform origin-top-right ${
                  showNotifications
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
              >
                <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <h4 className="font-black text-sm text-slate-800">
                    Thông báo
                  </h4>
                  <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-lg">
                    {unreadCount} MỚI
                  </span>
                </div>

                <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={`p-4 border-b border-slate-50 last:border-0 hover:bg-red-50/50 transition-colors cursor-pointer flex gap-4 ${
                          !n.isRead ? "bg-red-50/20" : ""
                        }`}
                      >
                        <div
                          className={`p-2 rounded-xl h-fit ${
                            !n.isRead
                              ? "bg-red-50 text-red-600"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {n.type === "success" ? (
                            <CheckCircle2 size={16} />
                          ) : (
                            <AlertCircle size={16} />
                          )}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`text-xs mb-0.5 ${
                              !n.isRead
                                ? "font-black text-slate-900"
                                : "font-bold text-slate-600"
                            }`}
                          >
                            {n.title}
                          </p>
                          <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                            {n.message}
                          </p>
                          <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">
                            {n.time}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center">
                      <p className="text-xs font-bold text-slate-400 italic">
                        Không có thông báo nào
                      </p>
                    </div>
                  )}
                </div>

                <button className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-600 hover:bg-slate-50 transition-all border-t border-slate-50">
                  Xem tất cả hoạt động
                </button>
              </div>
            </div>

            <div
              className="relative py-2"
              onMouseEnter={() => setShowUserMenu(true)}
              onMouseLeave={() => setShowUserMenu(false)}
            >
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200 cursor-pointer group">
                <div className="text-right hidden sm:block transition-all group-hover:mr-1">
                  <p className="text-xs font-black text-slate-900">
                    {user.name || "Quản trị viên"}
                  </p>
                  <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">
                    Tác giả
                  </p>
                </div>
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center border-2 border-white shadow-md overflow-hidden group-hover:rotate-6 transition-transform">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      className="w-full h-full object-cover"
                      alt="avatar"
                    />
                  ) : (
                    <span className="text-white font-black text-xs uppercase">
                      {user.name ? user.name.substring(0, 2) : "AD"}
                    </span>
                  )}
                </div>
              </div>

              <div
                className={`absolute right-0 mt-2 w-64 bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden transition-all duration-300 transform origin-top-right ${
                  showUserMenu
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
              >
                <div className="p-6 bg-slate-50/50 border-b border-slate-100 text-center">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-white border-4 border-white shadow-sm mx-auto mb-3 overflow-hidden">
                    <img
                      src={`https://ui-avatars.com/api/?name=${
                        user.name || "Admin"
                      }&background=FF3B30&color=fff`}
                      className="w-full h-full object-cover"
                      alt="avatar"
                    />
                  </div>
                  <p className="text-sm font-black text-slate-900 truncate px-2">
                    {user.name || "Quản trị viên"}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 truncate px-2">
                    {user.email || "admin@vndaily.vn"}
                  </p>
                </div>
                <div className="p-3">
                  <Link
                    to="/admin/profile"
                    className="w-full flex items-center gap-3 p-3 rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-red-600 font-bold text-xs transition-all group/btn"
                  >
                    <div className="bg-slate-100 p-2 rounded-lg group-hover/btn:bg-red-100 transition-colors">
                      <User size={14} />
                    </div>
                    <span>Hồ sơ cá nhân</span>
                  </Link>
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-blue-600 font-bold text-xs transition-all group/btn"
                  >
                    <div className="bg-slate-100 p-2 rounded-lg group-hover/btn:bg-blue-100 transition-colors">
                      {/* Đổi icon dựa theo theme */}
                      {theme === "dark" ? (
                        <Sun size={14} />
                      ) : (
                        <Moon size={14} />
                      )}
                    </div>

                    {/* Đổi text dựa theo theme */}
                    <span>
                      {theme === "dark" ? "Chế độ Sáng" : "Chế độ Tối"}
                    </span>
                  </button>
                  <div className="h-px bg-slate-50 my-2 mx-4"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl text-red-600 hover:bg-red-50 font-bold text-xs transition-all"
                  >
                    <div className="bg-red-100 p-2 rounded-lg">
                      <LogOut size={14} />
                    </div>
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Khu vực nội dung thay đổi */}
        <main className="p-10 flex-1 overflow-y-auto custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
