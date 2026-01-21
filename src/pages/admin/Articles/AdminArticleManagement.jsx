import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Trash2,
  Loader2,
  Inbox,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
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

        const serverResponse = res.data;

        if (serverResponse && serverResponse.status === 200) {
          setArticles(serverResponse.data || []);

          const pg = serverResponse.pagination;
          setPagination({
            current_page: pg.current_page,
            last_page: pg.last_page,
            total: pg.total,
            per_page: pg.limit,
          });
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    },
    [searchTerm]
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchArticles(1);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchArticles]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      fetchArticles(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Gỡ bài viết công khai?",
      text: "Bài viết này sẽ bị xóa khỏi hệ thống!",
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

  // Hàm tạo danh sách các số trang cần hiển thị (tránh hiện quá nhiều nút)
  const renderPaginationNodes = () => {
    const nodes = [];
    const { current_page, last_page } = pagination;

    for (let i = 1; i <= last_page; i++) {
      if (
        i === 1 ||
        i === last_page ||
        (i >= current_page - 1 && i <= current_page + 1)
      ) {
        nodes.push(i);
      } else if (i === current_page - 2 || i === current_page + 2) {
        nodes.push("...");
      }
    }
    return [...new Set(nodes)];
  };

  return (
    <div className="p-8 bg-[#fafafa] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter">
            Bài viết đã xuất bản
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Tổng cộng:{" "}
            <span className="text-rose-600 font-bold">{pagination.total}</span>{" "}
            bài viết
          </p>
        </div>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề..."
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
              <th className="px-8 py-5">Nội dung</th>
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
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/150";
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-rose-600 transition-colors">
                          {article.title}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">
                          {article.category?.name || "Chưa phân loại"} •{" "}
                          {article.created_at
                            ? new Date(article.created_at).toLocaleDateString(
                                "vi-VN"
                              )
                            : "---"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-slate-600">
                      {article.author?.name || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-black text-slate-700">
                      {article.views?.toLocaleString() || 0}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <a
                        href={`/article/${article.slug}`}
                        target="_blank"
                        rel="noreferrer"
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
                      Không tìm thấy bài viết nào
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PHÂN TRANG NÂNG CẤP */}
      {!loading && pagination.last_page > 1 && (
        <div className="flex items-center justify-between mt-8 px-4">
          <p className="text-slate-400 text-sm font-medium italic">
            Hiển thị trang {pagination.current_page} trên {pagination.last_page}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 disabled:opacity-30 hover:text-rose-600 transition-all shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>

            {renderPaginationNodes().map((page, index) =>
              page === "..." ? (
                <span key={`dots-${index}`} className="px-2 text-slate-400">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                    pagination.current_page === page
                      ? "bg-rose-600 text-white shadow-lg shadow-rose-200 scale-110"
                      : "bg-white text-slate-400 border border-slate-200 hover:border-rose-300 hover:text-rose-600 shadow-sm"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
              className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 disabled:opacity-30 hover:text-rose-600 transition-all shadow-sm"
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
