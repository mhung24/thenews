import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Mail,
  Globe,
  Check,
  Camera,
  Loader2,
  Save,
  Edit3,
  Award,
  Eye,
  Lock,
  KeyRound,
} from "lucide-react";
import { userService } from "../../../services/userService";
import { notification } from "../../../utils/swal";
import { getImageUrl } from "../../../utils/imageHelper";

const EditInput = ({
  value,
  onChange,
  placeholder,
  icon: Icon,
  type = "text",
}) => (
  <div className="relative w-full">
    {Icon && (
      <Icon
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    )}
    <input
      type={type}
      className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pr-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
        Icon ? "pl-10" : "pl-4"
      }`}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

const AuthorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  const [userInfo, setUserInfo] = useState({
    name: "",
    role: "",
    bio: "",
    location: "",
    email: "",
    website: "",
    phone: "",
    avatar: "",
    stats: {
      followers: "0",
      posts: "0",
      totalViews: "0",
    },
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userService.getProfile();
        const data = res.data;

        setUserInfo((prev) => ({
          ...prev,
          name: data.name || "",
          email: data.email || "",
          role:
            data.role === "admin"
              ? "Quản trị viên"
              : data.role === "author"
              ? "Tác giả"
              : "Thành viên",
          bio: data.bio || "",
          location: data.location || "",
          website: data.website || "",
          phone: data.phone || "",
          avatar: data.avatar || "",
        }));
      } catch {
        notification.error("Không thể tải thông tin hồ sơ.");
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await userService.updateProfile({
        name: userInfo.name,
        phone: userInfo.phone,
        bio: userInfo.bio,
        location: userInfo.location,
        website: userInfo.website,
      });
      notification.success("Đã lưu hồ sơ thành công!");
      setIsEditing(false);
    } catch {
      notification.error("Lỗi khi lưu hồ sơ.");
    } finally {
      setIsLoading(false);
    }
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleChangePassword = async () => {
    if (!passwordData.current_password || !passwordData.new_password) {
      notification.error("Vui lòng nhập đầy đủ thông tin mật khẩu.");
      return;
    }

    if (!validatePassword(passwordData.new_password)) {
      notification.error(
        "Mật khẩu mới phải trên 8 ký tự, gồm chữ hoa, số và ký tự đặc biệt."
      );
      return;
    }

    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      notification.error("Mật khẩu xác nhận không khớp.");
      return;
    }

    setIsChangingPass(true);
    try {
      await userService.changePassword(passwordData);
      notification.success("Đổi mật khẩu thành công!");
      setPasswordData({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    } catch (error) {
      notification.error(
        error.response?.data?.message || "Lỗi khi đổi mật khẩu."
      );
    } finally {
      setIsChangingPass(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notification.error("Vui lòng chỉ chọn file ảnh!");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await userService.uploadAvatar(formData);
      const newAvatarUrl = res.data?.data?.url;

      if (newAvatarUrl) {
        setUserInfo((prev) => ({ ...prev, avatar: newAvatarUrl }));
        notification.success("Cập nhật ảnh đại diện thành công!");
      }
    } catch {
      notification.error("Lỗi upload ảnh.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto space-y-8">
        <section className="relative bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="h-48 md:h-64 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative"></div>

          <div className="px-8 pb-8">
            <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 md:-mt-20">
              <div className="relative group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-white p-2 shadow-xl">
                  <div className="w-full h-full bg-slate-100 rounded-[2rem] flex items-center justify-center overflow-hidden relative">
                    {isUploading ? (
                      <Loader2
                        className="animate-spin text-slate-400"
                        size={32}
                      />
                    ) : (
                      <img
                        src={
                          getImageUrl(userInfo.avatar) ||
                          `https://ui-avatars.com/api/?name=${userInfo.name}&background=random`
                        }
                        alt={userInfo.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
                <label className="absolute bottom-2 right-2 p-2.5 bg-slate-900 text-white rounded-full cursor-pointer hover:bg-blue-600 transition-all shadow-lg z-10">
                  <Camera size={18} />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                  />
                </label>
              </div>

              <div className="flex-1 text-center md:text-left mb-2 w-full md:w-auto">
                <div className="flex flex-col gap-2">
                  {isEditing ? (
                    <div className="space-y-2 max-w-xs mx-auto md:mx-0">
                      <EditInput
                        value={userInfo.name}
                        onChange={(e) =>
                          setUserInfo({ ...userInfo, name: e.target.value })
                        }
                        placeholder="Tên hiển thị"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                        <h1 className="text-3xl font-black text-slate-900">
                          {userInfo.name}
                        </h1>
                        <div className="p-1 bg-blue-500 text-white rounded-full">
                          <Check size={14} />
                        </div>
                      </div>
                      <p className="text-slate-500 font-bold">
                        {userInfo.role}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mb-2">
                <button
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  disabled={isLoading}
                  className={`flex items-center gap-2 px-6 py-3 text-white rounded-2xl text-sm font-bold transition-all shadow-lg ${
                    isEditing
                      ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200"
                      : "bg-slate-900 hover:bg-slate-800 shadow-slate-200"
                  }`}
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : isEditing ? (
                    <>
                      <Save size={18} /> Lưu hồ sơ
                    </>
                  ) : (
                    <>
                      <Edit3 size={18} /> Chỉnh sửa
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
                Thông tin liên hệ
              </h3>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <Globe size={18} />
                  </div>
                  {isEditing ? (
                    <EditInput
                      value={userInfo.website}
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, website: e.target.value })
                      }
                      placeholder="Website cá nhân"
                    />
                  ) : (
                    <a
                      href={userInfo.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-bold text-slate-600 hover:text-blue-600 truncate"
                    >
                      {userInfo.website || "Chưa cập nhật"}
                    </a>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-50 space-y-3">
                  <div className="flex items-center gap-3 text-slate-400">
                    <MapPin size={16} className="shrink-0" />
                    {isEditing ? (
                      <EditInput
                        value={userInfo.location}
                        onChange={(e) =>
                          setUserInfo({ ...userInfo, location: e.target.value })
                        }
                        placeholder="Địa chỉ / Thành phố"
                      />
                    ) : (
                      <span className="text-sm font-medium">
                        {userInfo.location || "Chưa cập nhật địa chỉ"}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-slate-400">
                    <Mail size={16} className="shrink-0" />
                    <span className="text-sm font-medium truncate">
                      {userInfo.email}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-400">
                    <span className="shrink-0 text-xs">📞</span>
                    {isEditing ? (
                      <EditInput
                        value={userInfo.phone}
                        onChange={(e) =>
                          setUserInfo({ ...userInfo, phone: e.target.value })
                        }
                        placeholder="Số điện thoại"
                      />
                    ) : (
                      <span className="text-sm font-medium">
                        {userInfo.phone || "Chưa cập nhật SĐT"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
                Bảo mật tài khoản
              </h3>
              <div className="space-y-4">
                <EditInput
                  type="password"
                  icon={Lock}
                  placeholder="Mật khẩu hiện tại"
                  value={passwordData.current_password}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      current_password: e.target.value,
                    })
                  }
                />
                <EditInput
                  type="password"
                  icon={KeyRound}
                  placeholder="Mật khẩu mới"
                  value={passwordData.new_password}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      new_password: e.target.value,
                    })
                  }
                />
                <EditInput
                  type="password"
                  icon={Check}
                  placeholder="Xác nhận mật khẩu mới"
                  value={passwordData.new_password_confirmation}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      new_password_confirmation: e.target.value,
                    })
                  }
                />
                <button
                  onClick={handleChangePassword}
                  disabled={isChangingPass}
                  className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-100 flex items-center justify-center gap-2"
                >
                  {isChangingPass ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    "Cập nhật mật khẩu"
                  )}
                </button>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
                Thành tựu
              </h3>
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl flex items-center gap-2 font-bold text-xs">
                  <Award size={16} /> Top Writer
                </div>
                <div className="px-4 py-2 bg-purple-50 text-purple-600 rounded-xl flex items-center gap-2 font-bold text-xs">
                  <Eye size={16} /> Hot Profile
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  label: "Followers",
                  value: userInfo.stats.followers,
                  color: "text-blue-600",
                },
                {
                  label: "Posts",
                  value: userInfo.stats.posts,
                  color: "text-slate-900",
                },
                {
                  label: "Lượt xem",
                  value: userInfo.stats.totalViews,
                  color: "text-slate-900",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm text-center"
                >
                  <p className={`text-2xl font-black mb-1 ${s.color}`}>
                    {s.value}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black">Giới thiệu</h3>
              </div>
              {isEditing ? (
                <textarea
                  className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-600 font-medium leading-relaxed focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  rows="6"
                  placeholder="Viết đôi dòng giới thiệu về bạn..."
                  value={userInfo.bio}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, bio: e.target.value })
                  }
                />
              ) : (
                <p className="text-slate-600 font-medium leading-relaxed text-lg whitespace-pre-line">
                  {userInfo.bio || "Chưa có giới thiệu..."}
                </p>
              )}
            </div>

            <div className="opacity-50 hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-between px-4 mb-4">
                <h3 className="text-xl font-black text-slate-400">
                  Bài viết gần đây
                </h3>
                <span className="text-xs font-bold text-slate-400">
                  Coming soon...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorProfile;
