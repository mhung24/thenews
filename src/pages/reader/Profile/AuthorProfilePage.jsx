import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  UserPlus,
  UserCheck,
  Flag,
  Loader2,
  Eye,
  Calendar,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import api from "../../../services/api";
import Header from "../Home/components/Header";
import Footer from "../Home/Footer/Footer";

const AuthorProfilePage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  const loadProfile = async () => {
    try {
      const res = await api.get(`/authors/${id}`);
      setData(res.data);
    } catch (error) {
      console.error(error);
      Swal.fire("Lỗi!", "Không thể tải thông tin tác giả", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [id]);

  const handleFollow = async () => {
    const token = localStorage.getItem("token");
    if (!token)
      return Swal.fire("Thông báo", "Vui lòng đăng nhập để theo dõi", "info");

    setFollowLoading(true);
    try {
      const res = await api.post(`/authors/${id}/follow`);
      setData((prev) => ({
        ...prev,
        is_following: res.data.is_following,
        follower_count: res.data.is_following
          ? prev.follower_count + 1
          : prev.follower_count - 1,
      }));
    } catch (error) {
      Swal.fire("Lỗi", "Không thể thực hiện thao tác", "error");
    } finally {
      setFollowLoading(false);
    }
  };

  const handleReport = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Báo cáo tác giả",
      html:
        '<div class="text-left mb-2 text-sm font-bold">Lý do báo cáo:</div>' +
        '<select id="swal-type" class="swal2-input w-full m-0 mb-4 text-sm">' +
        '<option value="Spam">Spam nội dung</option>' +
        '<option value="Xúc phạm">Quấy rối / Xúc phạm</option>' +
        '<option value="Sai sự thật">Thông tin sai sự thật</option>' +
        '<option value="Bản quyền">Vi phạm bản quyền</option>' +
        "</select>" +
        '<div class="text-left mb-2 text-sm font-bold">Mô tả chi tiết:</div>' +
        '<textarea id="swal-description" class="swal2-textarea w-full m-0 h-32" placeholder="Mô tả ít nhất 10 ký tự..."></textarea>',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Gửi báo cáo",
      confirmButtonColor: "#e11d48",
      cancelButtonText: "Hủy",
      preConfirm: () => {
        const type = document.getElementById("swal-type").value;
        const description = document.getElementById("swal-description").value;
        if (!description || description.length < 10) {
          Swal.showValidationMessage("Mô tả phải có ít nhất 10 ký tự");
          return false;
        }
        return { type, description };
      },
    });

    if (formValues) {
      try {
        await api.post(`/authors/${id}/report`, {
          ...formValues,
          priority: "Medium",
        });
        Swal.fire(
          "Thành công",
          "Báo cáo đã được gửi tới kiểm duyệt viên",
          "success"
        );
      } catch (error) {
        Swal.fire(
          "Lỗi",
          error.response?.data?.message || "Cần đăng nhập để báo cáo",
          "error"
        );
      }
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-red-700" size={40} />
      </div>
    );

  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans">
      <Header />
      <main className="container mx-auto px-4 lg:px-20 py-12">
        <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-10 mb-16">
          <div className="w-40 h-40 rounded-full bg-red-700 text-white flex items-center justify-center text-5xl font-black italic shadow-2xl border-8 border-white uppercase">
            {data?.author?.name?.charAt(0)}
          </div>

          <div className="flex-grow text-center md:text-left">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-800 mb-3">
              {data?.author?.name}
            </h1>
            <p className="text-slate-500 text-lg font-medium max-w-2xl mb-6">
              {data?.author?.bio || "Một cây bút tâm huyết của VN Daily."}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-8">
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  Người theo dõi
                </p>
                <p className="text-xl font-black text-red-700 italic">
                  {data?.follower_count}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  Bài viết
                </p>
                <p className="text-xl font-black text-slate-800 italic">
                  {data?.articles?.length}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto min-w-[200px]">
            <button
              onClick={handleFollow}
              disabled={followLoading}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all ${
                data?.is_following
                  ? "bg-slate-100 text-slate-500"
                  : "bg-red-700 text-white shadow-lg"
              }`}
            >
              {data?.is_following ? (
                <UserCheck size={18} />
              ) : (
                <UserPlus size={18} />
              )}
              {data?.is_following ? "Đang theo dõi" : "Theo dõi"}
            </button>
            <button
              onClick={handleReport}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest text-slate-400 hover:text-red-700 hover:bg-red-50 transition-all border border-slate-100"
            >
              <Flag size={16} /> Báo cáo vi phạm
            </button>
          </div>
        </div>

        <div className="mb-10 flex items-center gap-4">
          <BookOpen className="text-red-700" size={24} />
          <h2 className="text-2xl font-black uppercase italic tracking-tight text-slate-800">
            Bài viết của tác giả
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {data?.articles?.map((article) => (
            <Link
              to={`/article/${article.slug}`}
              key={article.id}
              className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}${
                    article.image_url
                  }`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt=""
                />
              </div>
              <div className="p-8">
                <h3 className="font-bold text-xl text-slate-800 line-clamp-2 uppercase italic mb-4 group-hover:text-red-700 transition-colors">
                  {article.title}
                </h3>
                <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1">
                    <Eye size={12} /> {article.views} lượt xem
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />{" "}
                    {new Date(article.created_at).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AuthorProfilePage;
