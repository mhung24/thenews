import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Loader2,
  ChevronRight,
  FileText,
  ChevronDown,
  Calendar,
  User,
} from "lucide-react";
import { dashboardService } from "../../../services/dashboardService";

const ModModerationList = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        search: searchTerm,
        category_id: selectedCategory,
      };
      const res = await dashboardService.getPendingArticles(params);
      setArticles(res.data.data || []);
      if (res.data.categories) {
        setCategories(res.data.categories);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchArticles();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchArticles]);

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
            Hàng đợi kiểm duyệt
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Quản lý và phê duyệt nội dung mới
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-white">
            <div className="relative w-full max-w-md">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Tìm kiếm tiêu đề hoặc tác giả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
              />
            </div>

            <div className="relative w-full md:w-auto">
              <Filter
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={16}
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none w-full md:w-56 pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 outline-none hover:bg-slate-50 cursor-pointer transition-all shadow-sm"
              >
                <option value="">Lọc chuyên mục</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                size={14}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-[10px] uppercase tracking-widest font-black border-y border-slate-50 bg-slate-50/30">
                  <th className="px-8 py-4">Nội dung bài viết</th>
                  <th className="px-8 py-4">Tác giả</th>
                  <th className="px-8 py-4">Thời gian gửi</th>
                  <th className="px-8 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="py-20 text-center">
                      <Loader2
                        className="animate-spin mx-auto text-indigo-600"
                        size={32}
                      />
                    </td>
                  </tr>
                ) : articles.length > 0 ? (
                  articles.map((item) => (
                    <tr
                      key={item.id}
                      className="group hover:bg-slate-50/80 transition-all cursor-pointer"
                      onClick={() => navigate(`/moderator/review/${item.id}`)}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shadow-sm flex-shrink-0">
                            {item.image_url ? (
                              <img
                                src={
                                  item.image_url.startsWith("http")
                                    ? item.image_url
                                    : `${baseUrl}${item.image_url}`
                                }
                                className="w-full h-full object-cover"
                                alt={item.title}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                                <FileText size={20} />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                              {item.title}
                            </p>
                            <span className="text-[9px] font-black uppercase text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                              {item.category?.name || "Chưa phân loại"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-100 overflow-hidden flex-shrink-0">
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.author_id}`}
                              alt=""
                            />
                          </div>
                          <span className="text-sm font-bold text-slate-600">
                            {item.author?.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-600 font-bold">
                            {new Date(item.created_at).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium uppercase">
                            {new Date(item.created_at).toLocaleTimeString(
                              "vi-VN",
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="inline-flex p-2 bg-slate-100 text-slate-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                          <ChevronRight size={18} />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-30 text-slate-400">
                        <FileText size={48} />
                        <p className="font-black uppercase text-xs tracking-widest">
                          Không có bài viết chờ duyệt
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModModerationList;
