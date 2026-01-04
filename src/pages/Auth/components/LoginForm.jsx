import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { authService } from "../../../services/authService";
import Swal from "sweetalert2";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const res = await authService.login(email, password);

      if (res.access_token) {
        localStorage.setItem("token", res.access_token);

        const userRole = res.data?.role?.toLowerCase() || "author";
        localStorage.setItem("user_role", userRole);

        if (userRole === "author" && password === "author@123") {
          setIsLoading(false);
          await Swal.fire({
            title: "Bảo mật tài khoản",
            text: "Bạn đang sử dụng mật khẩu mặc định. Để đảm bảo an toàn, vui lòng đổi mật khẩu mới ngay lập tức!",
            icon: "warning",
            confirmButtonText: "Đổi mật khẩu ngay",
            confirmButtonColor: "#dc2626",
            allowOutsideClick: false,
          });
          window.location.href = "/admin/profile?tab=security";
          return;
        }

        setStatus({
          type: "success",
          message: "Đăng nhập thành công! Đang chuyển hướng...",
        });

        setTimeout(() => {
          if (userRole === "admin" || userRole === "moderator") {
            window.location.href = "/moderator";
          } else {
            window.location.href = "/admin";
          }
        }, 1000);
      } else {
        setStatus({
          type: "error",
          message: "Phản hồi từ hệ thống không hợp lệ.",
        });
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Thông tin đăng nhập không chính xác.";
      setStatus({ type: "error", message: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-12 md:p-16 bg-white flex flex-col justify-center">
      <div className="max-w-[360px] mx-auto w-full">
        <div className="mb-10 text-center md:text-left">
          <h3 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
            Chào mừng trở lại
          </h3>
          <p className="text-gray-400 text-sm font-medium">
            Nhập tài khoản nhân sự để tiếp tục
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {status.type && (
            <div
              className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${
                status.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle2 size={18} />
              ) : (
                <AlertCircle size={18} />
              )}
              <span className="text-[10px] font-black uppercase tracking-tight">
                {status.message}
              </span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
              Email
            </label>
            <div className="relative group">
              <Mail
                size={18}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-red-600 transition-colors"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@vndaily.vn"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-12 py-4 text-sm outline-none focus:bg-white focus:border-red-200 focus:ring-4 focus:ring-red-50 transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Mật khẩu
              </label>
              <button
                type="button"
                className="text-[10px] font-black uppercase text-red-600 hover:underline"
              >
                Quên mật khẩu?
              </button>
            </div>
            <div className="relative group">
              <Lock
                size={18}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-red-600 transition-colors"
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-12 py-4 text-sm outline-none focus:bg-white focus:border-red-200 focus:ring-4 focus:ring-red-50 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full group flex items-center justify-center gap-3 bg-gray-900 text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-gray-200 hover:bg-red-600 active:scale-[0.98] transition-all disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <span>Tiến vào CMS</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
