import React, { useState, useEffect } from "react";
import { getImageUrl } from "../../../utils/imageHelper";

import {
  Search,
  Eye,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileEdit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Loader2,
  MessageSquareOff,
  Lock,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { articleService } from "../../../services/articleService";
import { notification } from "../../../utils/swal";

const MyArticles = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({ current: 1, total: 1 });

  const fetchArticles = async (page = 1) => {
    setLoading(true);
    try {
      const response = await articleService.getMyArticles({
        page,
        keyword: searchQuery,
        status: filterStatus !== "ALL" ? filterStatus.toLowerCase() : "",
      });

      if (response.data && response.data.data) {
        const result = response.data.data;
        setArticles(result.data || []);
        setPagination({
          current: result.current_page || 1,
          total: result.last_page || 1,
        });
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách bài viết:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [filterStatus, searchQuery]);

  const handleDelete = async (id) => {
    const confirm = await notification.confirm(
      "Xóa bài viết?",
      "Hành động này sẽ xóa vĩnh viễn bài viết khỏi hệ thống!"
    );

    if (confirm) {
      try {
        await articleService.delete(id);
        notification.success("Đã xóa bài viết thành công!");
        fetchArticles(pagination.current);
      } catch (error) {
        console.error("Lỗi xóa bài:", error);
        notification.error("Không thể xóa bài viết. Vui lòng thử lại.");
      }
    }
  };

  const showRejectReason = (reason) => {
    notification.info(
      "Thông tin từ kiểm duyệt",
      reason || "Vui lòng kiểm tra lại nội dung hoặc liên hệ quản trị viên."
    );
  };

  const getStatusBadge = (status, reason) => {
    const base =
      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit";

    switch (status?.toLowerCase()) {
      case "published":
        return (
          <span
            className={`${base} bg-green-50 text-green-600 border border-green-100`}
          >
            <CheckCircle2 size={12} /> Đã đăng
          </span>
        );
      case "pending":
        return (
          <span
            className={`${base} bg-amber-50 text-amber-600 border border-amber-100`}
          >
            <Clock size={12} /> Chờ duyệt
          </span>
        );
      case "repair":
        return (
          <div className="flex flex-col gap-1">
            <button
              onClick={() => showRejectReason(reason)}
              className={`${base} bg-orange-50 text-orange-600 border border-orange-100 hover:bg-orange-100 transition-all`}
            >
              <AlertCircle size={12} /> Yêu cầu sửa
            </button>
            {reason && (
              <p className="text-[9px] text-orange-500 italic font-black max-w-[120px] line-clamp-1 ml-1">
                Lý do: {reason}
              </p>
            )}
          </div>
        );
      case "rejected":
        return (
          <div className="flex flex-col gap-1">
            <span
              className={`${base} bg-slate-900 text-white border border-slate-800 shadow-lg`}
            >
              <MessageSquareOff size={12} /> Bị từ chối
            </span>
            <p className="text-[8px] text-slate-400 font-black uppercase tracking-tighter ml-1 flex items-center gap-1">
              <Lock size={10} /> Đã khóa sửa
            </p>
          </div>
        );
      case "cancel":
        return (
          <span
            className={`${base} bg-slate-100 text-slate-400 border border-slate-200`}
          >
            <XCircle size={12} /> Đã hủy
          </span>
        );
      default:
        return (
          <span className={`${base} bg-slate-50 text-slate-400`}>Bản nháp</span>
        );
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <nav className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3">
            <span>Quản trị</span>
            <span>/</span>
            <span className="text-red-600">Bài viết của tôi</span>
          </nav>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">
            Article Archive
          </h1>
        </div>

        <button
          onClick={() => navigate("/admin/write")}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-red-100 transition-all flex items-center gap-3 active:scale-95"
        >
          <Plus size={20} />
          <span>Tạo nội dung mới</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm mb-8 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm kiếm nội dung..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-4 py-4 text-sm focus:ring-2 focus:ring-red-100 outline-none transition-all font-bold"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {[
            { id: "ALL", label: "Tất cả" },
            { id: "PUBLISHED", label: "Đã đăng" },
            { id: "PENDING", label: "Chờ duyệt" },
            { id: "REPAIR", label: "Yêu cầu sửa" },
            { id: "REJECTED", label: "Bị từ chối" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filterStatus === tab.id
                  ? "bg-slate-900 text-white shadow-lg"
                  : "bg-white text-slate-400 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="animate-spin text-red-600" size={48} />
            <p className="text-slate-400 font-bold italic">
              Đang đồng bộ dữ liệu...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Nội dung
                  </th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Trạng thái
                  </th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Chỉ số
                  </th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Thời gian
                  </th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {articles.map((art) => (
                  <tr
                    key={art.id}
                    className="group hover:bg-slate-50/30 transition-all"
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-6">
                        <img
                          src={getImageUrl(art.image_url)}
                          className="w-24 h-16 rounded-2xl object-cover shadow-sm ring-4 ring-white group-hover:ring-red-50 transition-all"
                          alt=""
                          onError={(e) => {
                            e.target.src =
                              "https://placehold.co/200x120?text=No+Image";
                          }}
                        />
                        <div className="max-w-md">
                          <p className="text-[10px] font-black text-red-600 uppercase tracking-wider mb-1">
                            {art.category?.name}
                          </p>
                          <h4 className="font-bold text-slate-800 leading-tight line-clamp-2 text-sm group-hover:text-red-600 transition-colors">
                            {art.title}
                          </h4>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      {getStatusBadge(art.status, art.rejection_reason)}
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4 text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Eye size={14} />
                          <span className="text-xs font-black">
                            {art.views?.toLocaleString() || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MessageCircle size={14} />
                          <span className="text-xs font-black">
                            {art.comment_count || 0}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-700">
                          {art.created_at}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          {art.created_at_human}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        {/* CHẶN SỬA KHI TRẠNG THÁI LÀ REJECTED, CANCEL HOẶC PUBLISHED */}
                        {art.status === "rejected" ||
                        art.status === "cancel" ||
                        art.status === "published" ? (
                          <button
                            disabled
                            className="p-3 bg-slate-50 text-slate-200 rounded-xl border border-slate-100 cursor-not-allowed"
                            title="Nội dung đã khóa, không thể chỉnh sửa"
                          >
                            <Lock size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={() => navigate(`/admin/edit/${art.id}`)}
                            className="p-3 bg-white hover:text-blue-600 rounded-xl border border-slate-100 shadow-sm transition-all text-slate-400"
                          >
                            <FileEdit size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(art.id)}
                          className="p-3 bg-white hover:text-red-600 rounded-xl border border-slate-100 shadow-sm transition-all text-slate-400"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && articles.length > 0 && (
          <div className="p-10 border-t border-slate-50 flex items-center justify-between bg-slate-50/20">
            <p className="text-xs font-bold text-slate-400 italic">
              Hiển thị {articles.length} bài viết
            </p>
            <div className="flex items-center gap-3">
              <button
                disabled={pagination.current === 1}
                onClick={() => fetchArticles(pagination.current - 1)}
                className="p-3 rounded-2xl border border-slate-200 bg-white text-slate-400 hover:text-red-600 disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm font-black px-4">
                Trang {pagination.current} / {pagination.total}
              </span>
              <button
                disabled={pagination.current === pagination.total}
                onClick={() => fetchArticles(pagination.current + 1)}
                className="p-3 rounded-2xl border border-slate-200 bg-white text-slate-400 hover:text-red-600 disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyArticles;
