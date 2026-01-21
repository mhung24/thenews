import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Trash2,
  Eye,
  Loader2,
  FileText,
  ExternalLink,
  Inbox,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Swal from "sweetalert2";
import { dashboardService } from "../../../services/dashboardService";

const AdminPublishedArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
  });

  const fetchArticles = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const res = await dashboardService.getAllArticles({
          status: "published",
          search: searchTerm.trim(),
          page: page,
          limit: 10,
        });

        // Khớp lại cấu trúc response của Laravel Pagination
        const result = res.data.data;
        setArticles(result.data || []);
        setPagination({
          current_page: result.current_page,
          last_page: result.last_page,
          total: result.total,
          per_page: result.per_page,
        });
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    },
    [searchTerm]
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchArticles(1); // Luôn về trang 1 khi tìm kiếm mới
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchArticles]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      fetchArticles(newPage);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Gỡ bài viết công khai?",
      text: "Bài viết này sẽ bị xóa khỏi hệ thống và không còn hiển thị với độc giả!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Xác nhận xóa",
      cancelButtonText: "Hủy",
      borderRadius: "1.5rem",
    });

    if (result.isConfirmed) {
      try {
        await dashboardService.deleteArticle(id);
        fetchArticles(pagination.current_page);
        Swal.fire({
          title: "Đã xóa!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          borderRadius: "1.5rem",
        });
      } catch (error) {
        Swal.fire("Lỗi!", "Không thể xóa bài viết.", "error");
      }
    }
  };

  return (
    <div className="p-8 bg-[#fafafa] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter">
            Bài viết đã xuất bản
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Quản lý nội dung đang hiển thị công khai ({pagination.total})
          </p>
        </div>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề hoặc tác giả..."
            className="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-rose-50 outline-none w-72 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <th className="px-8 py-5">Nội dung bài viết</th>
              <th className="px-6 py-5">Tác giả</th>
              <th className="px-6 py-5">Lượt xem</th>
              <th className="px-6 py-5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan="4" className="py-20 text-center">
                  <Loader2
                    className="animate-spin mx-auto text-rose-600"
                    size={32}
                  />
                </td>
              </tr>
            ) : articles.length > 0 ? (
              articles.map((article) => (
                <tr
                  key={article.id}
                  className="hover:bg-slate-50/30 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                        <img
                          src={`${import.meta.env.VITE_BACKEND_URL}${
                            article.image_url
                          }`}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-rose-600 transition-colors">
                          {article.title}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">
                          {article.category?.name} •{" "}
                          {new Date(article.created_at).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-slate-600">
                      {article.author?.name}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-black text-slate-700">
                      {article.views || 0}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <a
                        href={`/article/${article.slug}`}
                        target="_blank"
                        className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      >
                        <ExternalLink size={18} />
                      </a>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-24 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="p-4 bg-slate-50 rounded-full">
                      <Inbox className="text-slate-300" size={40} />
                    </div>
                    <p className="text-slate-800 font-bold">
                      {searchTerm
                        ? `Không có kết quả cho "${searchTerm}"`
                        : "Trống"}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination UI */}
      {!loading && articles.length > 0 && (
        <div className="flex items-center justify-between mt-6 px-4">
          <p className="text-slate-400 text-sm font-medium">
            Trang{" "}
            <span className="text-slate-700 font-bold">
              {pagination.current_page}
            </span>{" "}
            / {pagination.last_page}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 disabled:opacity-30 hover:text-rose-600"
            >
              <ChevronLeft size={20} />
            </button>
            {[...Array(pagination.last_page)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                  pagination.current_page === i + 1
                    ? "bg-rose-600 text-white shadow-lg"
                    : "bg-white text-slate-400 border border-slate-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
              className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 disabled:opacity-30 hover:text-rose-600"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPublishedArticles;
