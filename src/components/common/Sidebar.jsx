import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PenTool,
  FileText,
  DollarSign,
  LogOut,
  Plus,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: "dashboard",
      icon: LayoutDashboard,
      label: "Bảng điều khiển",
      path: "/admin",
    },
    { id: "write", icon: Plus, label: "Viết bài mới", path: "/admin/write" },
    {
      id: "my-content",
      icon: FileText,
      label: "Bài viết của tôi",
      path: "/admin/articles",
    },
    {
      id: "earnings",
      icon: DollarSign,
      label: "Thu nhập",
      path: "/admin/earnings",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col fixed h-full z-50">
      <div className="p-8 flex items-center gap-3">
        <div className="bg-red-600 p-2 rounded-xl shrink-0 shadow-lg shadow-red-200">
          <PenTool className="text-white" size={20} />
        </div>
        <h1 className="font-black text-xl italic tracking-tighter text-slate-900">
          VN<span className="text-red-600">Daily</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all font-bold text-sm ${
              location.pathname === item.path
                ? "bg-red-50 text-red-600"
                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            }`}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6">
        {/* <div className="bg-slate-900 rounded-[2rem] p-5 text-white relative overflow-hidden">
          <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mb-1">
            Cấp độ tác giả
          </p>
          <p className="text-sm font-black mb-3 text-red-400">
            Chuyên gia (Tier 1)
          </p>
          <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
            <div className="bg-red-500 h-full w-[75%]"></div>
          </div>
        </div> */}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-4 mt-4 text-slate-400 font-bold text-sm hover:text-red-600 transition-colors"
        >
          <LogOut size={18} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
