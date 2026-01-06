import React, { useState } from "react";
import axios from "axios";
import {
  X,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Facebook,
  Loader2,
} from "lucide-react";
import { notification } from "../../../../utils/swal";

const AuthModal = ({
  authMode,
  setAuthMode,
  showPassword,
  setShowPassword,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  if (!authMode) return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = authMode === "login" ? "/users/login" : "/users/register";
    const payload =
      authMode === "login"
        ? { email: formData.email, password: formData.password }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.password,
          };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        payload
      );

      const responseData = res.data;
      // Backend trả về access_token và data (user)
      const token = responseData.access_token;
      const user = responseData.data;

      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setAuthMode(null);
        notification.success(responseData.message || "Thành công!");

        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        notification.error(
          "Lỗi: Server không trả về Token. Vui lòng kiểm tra lại Backend."
        );
      }
    } catch (error) {
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        const firstError = Object.values(validationErrors)[0][0];
        notification.error(firstError || "Dữ liệu không hợp lệ");
      } else {
        const message =
          error.response?.data?.message ||
          "Lỗi: Vui lòng kiểm tra lại thông tin";
        notification.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={() => setAuthMode(null)}
      ></div>
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
        <button
          onClick={() => setAuthMode(null)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
        >
          <X size={20} />
        </button>
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              <div className="bg-red-700 text-white font-serif font-bold text-3xl px-2 py-0.5 rounded-sm shadow-sm">
                V
              </div>
              <span className="font-serif font-bold text-2xl text-red-700 tracking-tight italic uppercase">
                VN Daily
              </span>
            </div>
          </div>
          <h2 className="text-2xl font-black text-center text-gray-900 mb-2 uppercase italic tracking-tighter">
            {authMode === "login" ? "Chào mừng trở lại" : "Tạo tài khoản mới"}
          </h2>
          <p className="text-gray-500 text-center text-[10px] mb-8 font-bold italic uppercase tracking-widest text-gray-400">
            {authMode === "login"
              ? "Cập nhật tin tức cá nhân hóa"
              : "Lưu bài viết và thảo luận cùng cộng đồng"}
          </p>
          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === "register" && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="HỌ VÀ TÊN"
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-700/5 focus:border-red-700 transition font-bold text-sm italic"
                />
              </div>
            )}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <input
                name="email"
                type="email"
                required
                placeholder="EMAIL CỦA BẠN"
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-700/5 focus:border-red-700 transition font-bold text-sm italic"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="MẬT KHẨU"
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-700/5 focus:border-red-700 transition font-bold text-sm italic"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-700 text-white font-black py-4 rounded-xl hover:bg-red-800 transition shadow-xl shadow-red-200 uppercase italic tracking-widest flex justify-center items-center"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : authMode === "login" ? (
                "Đăng nhập"
              ) : (
                "Đăng ký ngay"
              )}
            </button>
          </form>
          <div className="grid grid-cols-2 gap-3 mt-8">
            <button className="flex items-center justify-center gap-2 py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition font-bold text-[11px] uppercase italic tracking-tighter">
              <Facebook size={16} className="text-blue-600 fill-current" />{" "}
              Facebook
            </button>
            <button className="flex items-center justify-center gap-2 py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition font-bold text-[11px] uppercase italic tracking-tighter">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.896 4.136-1.24 1.24-3.152 2.52-6.672 2.52-5.712 0-10.272-4.632-10.272-10.344s4.56-10.344 10.272-10.344c3.088 0 5.4 1.216 7.056 2.768l2.32-2.32c-2.392-2.288-5.504-4.048-9.376-4.048-7.536 0-13.728 6.136-13.728 13.728s6.192 13.728 13.728 13.728c4.088 0 7.184-1.344 9.6-3.856 2.52-2.52 3.32-6.048 3.32-8.688 0-.816-.072-1.6-.2-2.352h-12.72z"
                />
              </svg>{" "}
              Google
            </button>
          </div>
          <p className="mt-10 text-center text-[11px] font-bold text-gray-400 uppercase italic tracking-widest">
            {authMode === "login" ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
            <button
              onClick={() =>
                setAuthMode(authMode === "login" ? "register" : "login")
              }
              className="text-red-700 font-black hover:underline"
            >
              {authMode === "login" ? "Đăng ký" : "Đăng nhập"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
