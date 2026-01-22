import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Menu,
  X,
  Search,
  User,
  ChevronRight,
  LogOut,
  Bookmark,
  UserCircle,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import AuthModal from "../Auth/AuthModal";

const Header = ({ isMobileMenuOpen, setIsMobileMenuOpen, currentDate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [authMode, setAuthMode] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [temp, setTemp] = useState(null);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/categories`,
        );
        setCategories(res.data.data || res.data);
      } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
      }
    };
    fetchCategories();

    const handleStorageChange = () => {
      const savedUser = localStorage.getItem("user");
      setUser(savedUser ? JSON.parse(savedUser) : null);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsDropdownOpen(false);
    navigate("/");
    window.location.reload();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    } else {
      navigate("/search");
    }
    if (typeof setIsMobileMenuOpen === "function") {
      setIsMobileMenuOpen(false);
    }
  };

  const mainCategories = categories.slice(0, 6);
  const otherCategories = categories.slice(6);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=20.42&longitude=106.16&current_weather=true`,
        );

        setTemp(Math.round(response.data.current_weather.temperature));
      } catch (error) {
        console.error("Lỗi lấy thời tiết:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return (
    <header className="bg-white border-b-2 border-red-700 sticky top-0 z-50 shadow-sm">
      <AuthModal
        authMode={authMode}
        setAuthMode={setAuthMode}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />

      <div className="bg-gray-100 text-xs text-gray-500 py-1.5 hidden md:block border-b border-gray-200">
        <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span>{currentDate}</span>

            <span className="border-l border-gray-300 pl-4 flex items-center gap-1">
              {loading ? (
                <Loader2 size={12} className="animate-spin text-gray-300" />
              ) : (
                <>
                  <span className="text-orange-500 text-sm">☀</span>
                  <span className="font-bold text-gray-700">
                    Nam Định: {temp}°C
                  </span>
                </>
              )}
            </span>
          </div>
          <div className="flex gap-4">
            <Link to="/latest" className="hover:text-red-700">
              Mới nhất
            </Link>
            <Link
              to="/premium"
              className="hover:text-red-700 text-red-700 font-bold"
            >
              VN Daily Premium
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-4 md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
            <Search size={20} className="text-gray-500" />
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 group flex-shrink-0 mx-auto md:mx-0"
          >
            <div className="bg-red-700 text-white font-serif font-bold text-3xl px-2 py-1 rounded-sm shadow-sm group-hover:bg-red-800 transition">
              V
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif font-bold text-2xl md:text-3xl text-red-700 tracking-tight italic uppercase">
                VN Daily
              </span>
              <span className="text-[10px] md:text-xs text-gray-400 tracking-widest hidden sm:block italic">
                Dòng chảy tin tức
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-5 font-bold text-sm text-gray-700 uppercase tracking-tight">
            <Link
              to="/"
              className={`${
                location.pathname === "/"
                  ? "text-red-700"
                  : "hover:text-red-700"
              } transition`}
            >
              Trang chủ
            </Link>
            {mainCategories.map((item) => (
              <Link
                key={item.slug}
                to={`/category/${item.slug}`}
                className={`${
                  location.pathname.includes(item.slug)
                    ? "text-red-700"
                    : "hover:text-red-700"
                } transition relative group py-2`}
              >
                {item.name}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-red-700 transition-all ${
                    location.pathname.includes(item.slug)
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            ))}

            {otherCategories.length > 0 && (
              <div
                className="relative py-2 cursor-pointer group"
                onMouseEnter={() => setIsMoreOpen(true)}
                onMouseLeave={() => setIsMoreOpen(false)}
              >
                <div className="flex items-center gap-1 hover:text-red-700 transition">
                  <MoreHorizontal size={20} />
                </div>
                {isMoreOpen && (
                  <div className="absolute top-full left-0 pt-2 w-48 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden py-2">
                      {otherCategories.map((item) => (
                        <Link
                          key={item.slug}
                          to={`/category/${item.slug}`}
                          className="block px-4 py-2.5 text-[12px] font-bold text-gray-600 hover:bg-gray-50 hover:text-red-700 transition uppercase italic"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm..."
                className="pl-3 pr-8 py-1.5 text-sm bg-gray-100 rounded-full w-32 focus:w-48 transition-all focus:outline-none focus:ring-1 focus:ring-red-700 font-bold italic"
              />
              <button type="submit">
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-2 hover:text-red-700" />
              </button>
            </form>

            {user ? (
              <div className="flex items-center gap-3 border-l border-gray-200 pl-4 relative">
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <div className="text-right hidden sm:block leading-none">
                    <p className="text-[9px] font-black text-gray-400 uppercase italic leading-none">
                      Xin chào,
                    </p>
                    <p className="text-sm font-black text-red-700 italic uppercase mt-1 tracking-tighter">
                      {user.name}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-red-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  {isDropdownOpen && (
                    <div className="absolute top-full right-0 mt-0 pt-3 w-48 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden py-2">
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-red-700 transition"
                        >
                          <UserCircle size={16} /> TRANG CÁ NHÂN
                        </Link>
                        <Link
                          to="/bookmarks"
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-red-700 transition"
                        >
                          <Bookmark size={16} /> TIN ĐÃ LƯU
                        </Link>
                        <div className="h-px bg-gray-100 my-1 mx-4"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition"
                        >
                          <LogOut size={16} /> ĐĂNG XUẤT
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
                <button
                  onClick={() => setAuthMode("login")}
                  className="text-gray-500 hover:text-red-700 font-black uppercase text-[11px] italic tracking-widest transition"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => setAuthMode("register")}
                  className="bg-red-700 text-white px-4 py-1.5 rounded-full font-black uppercase text-[11px] italic tracking-widest shadow-lg shadow-red-100 hover:bg-red-800 transition"
                >
                  Đăng ký
                </button>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() =>
                user
                  ? setIsMobileMenuOpen(!isMobileMenuOpen)
                  : setAuthMode("login")
              }
            >
              <User
                size={24}
                className={user ? "text-red-700" : "text-gray-600"}
              />
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1 shadow-lg animate-in slide-in-from-top duration-300 overflow-y-auto max-h-[80vh]">
          {user && (
            <div className="p-4 bg-gray-50 rounded-2xl mb-4 border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-red-700 text-white flex items-center justify-center font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase italic leading-none">
                    Tài khoản
                  </p>
                  <p className="font-black text-red-700 uppercase italic tracking-tighter mt-1">
                    {user.name}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2 bg-white text-center rounded-lg text-[10px] font-black uppercase italic border border-gray-100"
                >
                  Cá nhân
                </Link>
                <Link
                  to="/bookmarks"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2 bg-white text-center rounded-lg text-[10px] font-black uppercase italic border border-gray-100"
                >
                  Đã lưu
                </Link>
              </div>
            </div>
          )}
          <form onSubmit={handleSearch} className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="TÌM KIẾM TIN TỨC..."
              className="w-full py-3 px-4 bg-gray-100 rounded-xl text-xs font-bold italic outline-none focus:ring-1 focus:ring-red-700"
            />
            <Search
              className="absolute right-4 top-3 text-gray-400"
              size={18}
            />
          </form>
          {categories.map((item) => (
            <Link
              key={item.slug}
              to={`/category/${item.slug}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-3 border-b border-gray-50 font-black text-gray-700 hover:text-red-700 flex justify-between items-center transition-colors italic text-sm uppercase"
            >
              {item.name} <ChevronRight size={16} className="text-gray-300" />
            </Link>
          ))}
          {!user ? (
            <div className="grid grid-cols-2 gap-3 mt-4 pt-2">
              <button
                onClick={() => {
                  setAuthMode("login");
                  setIsMobileMenuOpen(false);
                }}
                className="py-3 font-black text-gray-700 bg-gray-100 rounded-xl text-center text-[11px] uppercase italic"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => {
                  setAuthMode("register");
                  setIsMobileMenuOpen(false);
                }}
                className="py-3 font-black text-white bg-red-700 rounded-xl text-center text-[11px] uppercase italic shadow-lg shadow-red-100"
              >
                Đăng ký
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full py-3 mt-4 font-black text-red-700 border border-dashed border-red-200 rounded-xl uppercase text-xs italic tracking-widest"
            >
              Đăng xuất hệ thống
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
