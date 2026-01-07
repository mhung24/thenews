import React, { useState, useEffect } from "react";
import {
  Search,
  Trash2,
  Eye,
  Loader2,
  FileText,
  ExternalLink,
} from "lucide-react";
import Swal from "sweetalert2";
import { dashboardService } from "../../../services/dashboardService";

const AdminPublishedArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchArticles = async () => {
    setLoading(true);
    try {
      // Chỉ lấy status=published
      const res = await dashboardService.getAllArticles({
        status: "published",
        search: searchTerm,
      });
      setArticles(res.data.data || []);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

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
        setArticles(articles.filter((a) => a.id !== id));
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
            Quản lý nội dung đang hiển thị công khai
          </p>
        </div>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Tìm kiếm tiêu đề..."
            className="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-rose-50 outline-none w-72 transition-all shadow-sm"
            onKeyDown={(e) => e.key === "Enter" && fetchArticles()}
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
                <td
                  colSpan="4"
                  className="py-20 text-center text-slate-400 font-medium italic"
                >
                  Không có bài viết nào đang hiển thị.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPublishedArticles;
