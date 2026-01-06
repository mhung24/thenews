import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Shield,
  Camera,
  Edit3,
  Save,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../Home/components/Header";
import Footer from "../Home/Footer/Footer";

export default function ProfilePage() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: "Độc giả trung thành của VN Daily - Dòng chảy tin tức.",
  });

  const handleSave = () => {
    setIsEditing(false);
    const updatedUser = { ...user, name: formData.name };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header currentDate={new Date().toLocaleDateString("vi-VN")} />

      <main className="container mx-auto px-4 lg:px-8 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-red-700 transition-colors mb-8 text-[10px] font-black uppercase tracking-widest italic"
        >
          <ArrowLeft size={14} /> Quay lại trang chủ
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-red-700 to-red-900 relative"></div>

            <div className="px-8 pb-12">
              <div className="relative flex justify-between items-end -mt-12 mb-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-xl">
                    <div className="w-full h-full rounded-[1.25rem] bg-gray-100 flex items-center justify-center text-red-700 overflow-hidden border border-gray-100">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl font-black">
                          {user?.name?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <button className="absolute bottom-2 right-2 p-2 bg-gray-900 text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-700">
                    <Camera size={16} />
                  </button>
                </div>

                <button
                  onClick={() =>
                    isEditing ? handleSave() : setIsEditing(true)
                  }
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                    isEditing
                      ? "bg-green-600 text-white shadow-lg shadow-green-100"
                      : "bg-gray-100 text-gray-600 hover:bg-red-700 hover:text-white"
                  }`}
                >
                  {isEditing ? (
                    <>
                      <Save size={14} /> Lưu thay đổi
                    </>
                  ) : (
                    <>
                      <Edit3 size={14} /> Chỉnh sửa profile
                    </>
                  )}
                </button>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-8">
                  <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900 italic uppercase tracking-tighter">
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full bg-gray-50 border-b-2 border-red-700 outline-none py-1"
                        />
                      ) : (
                        user?.name
                      )}
                    </h1>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2 flex items-center gap-2 italic">
                      <Shield size={14} className="text-red-700" /> Thành viên
                      VN Daily Premium
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                        Địa chỉ Email
                      </label>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-gray-600 font-bold text-sm">
                        <Mail size={18} className="text-gray-300" />{" "}
                        {user?.email}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                        Ngày tham gia
                      </label>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-gray-600 font-bold text-sm">
                        <Calendar size={18} className="text-gray-300" />{" "}
                        01/01/2026
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                      Giới thiệu bản thân
                    </label>
                    <textarea
                      disabled={!isEditing}
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-medium min-h-[120px] outline-none focus:ring-2 focus:ring-red-50 focus:border-red-200 transition-all disabled:bg-gray-50/50"
                    />
                  </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-4">
                  <div className="p-6 bg-red-50 rounded-[2rem] border border-red-100">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-red-700 mb-6 italic">
                      Hoạt động cá nhân
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-600 italic">
                          Tin đã lưu
                        </span>
                        <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-black text-red-700 shadow-sm">
                          12
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-600 italic">
                          Bình luận
                        </span>
                        <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-black text-red-700 shadow-sm">
                          45
                        </span>
                      </div>
                    </div>
                    <Link
                      to="/bookmarks"
                      className="mt-8 w-full py-3 bg-red-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest text-center block shadow-lg shadow-red-100 hover:bg-red-800 transition-all"
                    >
                      Xem tin đã lưu
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
