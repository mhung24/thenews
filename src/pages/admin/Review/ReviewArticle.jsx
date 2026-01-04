import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  CheckCircle,
  XCircle,
  ArrowLeft,
  User,
  Clock,
  Loader2,
  Layout,
  RefreshCcw,
} from "lucide-react";
import { dashboardService } from "../../../services/dashboardService";

const ReviewArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reviewNote, setReviewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState(null);
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await dashboardService.getArticleDetail(id);
        setArticle(res.data.data);
      } catch {
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Không thể tải nội dung bài viết.",
          confirmButtonText: "Quay lại",
        }).then(() => navigate("/moderator/moderation"));
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchArticle();
  }, [id, navigate]);

  const handleStatusUpdate = async (status) => {
    let config = {
      title: "Xác nhận phê duyệt?",
      text: "Bài viết sẽ được xuất bản công khai.",
      icon: "question",
      confirmButtonColor: "#4f46e5",
      confirmButtonText: "Đồng ý xuất bản",
    };

    if (status === "rejected") {
      config = {
        title: "Từ chối bài viết?",
        text: "Tác giả sẽ nhận được lý do từ chối.",
        icon: "warning",
        confirmButtonColor: "#e11d48",
        confirmButtonText: "Xác nhận từ chối",
      };
    } else if (status === "repair") {
      if (!reviewNote.trim()) {
        return Swal.fire({
          icon: "error",
          title: "Thiếu thông tin!",
          text: "Vui lòng nhập ghi chú hướng dẫn sửa chữa cho tác giả.",
          customClass: { popup: "rounded-[2rem]" },
        });
      }
      config = {
        title: "Yêu cầu sửa chữa?",
        text: "Gửi phản hồi yêu cầu tác giả cập nhật lại nội dung.",
        icon: "info",
        confirmButtonColor: "#d97706",
        confirmButtonText: "Gửi yêu cầu sửa",
      };
    }

    const result = await Swal.fire({
      ...config,
      showCancelButton: true,
      cancelButtonText: "Hủy",
      cancelButtonColor: "#94a3b8",
      reverseButtons: true,
      customClass: {
        popup: "rounded-[2rem]",
        confirmButton: "rounded-xl px-6 py-3 text-sm font-bold",
        cancelButton: "rounded-xl px-6 py-3 text-sm font-bold",
      },
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: "Đang xử lý...",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });

        // Đảm bảo review_note được gửi đi
        await dashboardService.updateArticleStatus(id, {
          status: status,
          review_note: reviewNote,
        });

        await Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Trạng thái bài viết đã được cập nhật.",
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: "rounded-[2rem]" },
        });

        navigate("/moderator/moderation");
      } catch (error) {
        console.error("Update error:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text:
            error.response?.data?.message ||
            "Có lỗi xảy ra khi cập nhật trạng thái.",
          customClass: { popup: "rounded-[2rem]" },
        });
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: "Pending", class: "bg-amber-50 text-amber-600" },
      repair: { label: "Repair", class: "bg-blue-50 text-blue-600" },
      published: {
        label: "Published",
        class: "bg-emerald-50 text-emerald-600",
      },
      rejected: { label: "Rejected", class: "bg-rose-50 text-rose-600" },
    };
    const current = statusMap[status] || {
      label: status,
      class: "bg-slate-50 text-slate-600",
    };
    return (
      <span
        className={`px-2 py-0.5 rounded-full font-bold uppercase ${current.class}`}
      >
        {current.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="h-6 w-[1px] bg-slate-200 mx-2" />
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-slate-800 truncate max-w-md">
              {article?.title}
            </h1>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <User size={12} /> {article?.author?.name}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />{" "}
                {new Date(article?.created_at).toLocaleDateString("vi-VN")}
              </span>
              {getStatusBadge(article?.status)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleStatusUpdate("published")}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
          >
            <CheckCircle size={18} /> Phê duyệt bài viết
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-white border-r border-slate-200">
          <div className="max-w-3xl mx-auto py-12 px-8">
            <div className="flex gap-2 mb-6">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                {article?.category?.name}
              </span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 leading-tight mb-8">
              {article?.title}
            </h1>
            {article?.image_url && (
              <img
                src={
                  article.image_url.startsWith("http")
                    ? article.image_url
                    : `${baseUrl}${article.image_url}`
                }
                alt="Cover"
                className="w-full h-96 object-cover rounded-[2.5rem] mb-10 shadow-2xl shadow-slate-200"
              />
            )}
            <div
              className="prose prose-slate prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: article?.content }}
            />
          </div>
        </main>

        <aside className="w-[400px] bg-slate-50 overflow-y-auto flex flex-col">
          <div className="flex border-b border-slate-200 sticky top-0 bg-slate-50 z-10">
            <button className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-indigo-600 border-b-2 border-indigo-600 bg-white">
              Kiểm duyệt
            </button>
          </div>
          <div className="p-6 space-y-8">
            <section className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800">
                Ghi chú cho tác giả
              </h3>
              <textarea
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="Nhập lý do hướng dẫn tác giả sửa lại..."
                className="w-full h-32 bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-100 resize-none"
              />
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleStatusUpdate("rejected")}
                  className="w-full py-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
                >
                  <XCircle size={16} /> Từ chối bài viết
                </button>
                <button
                  onClick={() => handleStatusUpdate("repair")}
                  className="w-full py-3 bg-amber-50 text-amber-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-100 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCcw size={16} /> Yêu cầu sửa chữa
                </button>
              </div>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ReviewArticle;
