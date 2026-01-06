import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Newspaper } from "lucide-react";
import LoginForm from "./components/LoginForm";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("user_role");

    if (token) {
      if (role === "admin" || role === "moderator") {
        navigate("/moderator", { replace: true });
      } else if (role === "user") {
        navigate("/", { replace: true });
      } else {
        navigate("/admin", { replace: true });
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
      <div className="w-full max-w-[900px] bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col md:flex-row border border-gray-100">
        <div className="w-full md:w-[40%] bg-red-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div>
            <div className="flex items-center gap-3 mb-20">
              <div className="bg-white p-2 rounded-xl">
                <Newspaper size={24} className="text-red-600" />
              </div>
              <h1 className="text-2xl font-black tracking-tighter uppercase">
                VN DAILY
              </h1>
            </div>
            <h2 className="text-4xl font-serif italic font-bold leading-tight mb-6">
              Hệ thống <br /> Quản trị Nội dung
            </h2>
            <div className="w-12 h-1 bg-white/30 rounded-full mb-6"></div>
            <p className="text-red-100 text-sm leading-relaxed opacity-80 max-w-[240px]">
              Dành riêng cho phóng viên và biên tập viên VN Daily.
            </p>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">
            © 2026 VN DAILY CMS
          </div>
        </div>

        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
