import React, { useState, useEffect, useMemo } from "react";
import {
  Eye,
  FileText,
  DollarSign,
  MessageSquare,
  ShieldCheck,
  Loader2,
  TrendingUp,
  Award,
  X,
  CheckCircle2,
  Star,
} from "lucide-react";
import { articleService } from "../../services/articleService";

const Dashboard = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    years_of_experience: 0,
    approved_articles_count: 0, // Chỉ đếm bài đã duyệt
  });
  const [stats, setStats] = useState({
    totalViews: "0",
    totalArticles: "0",
    earnings: "0",
    comments: "0",
  });

  const RANKS = [
    { level: 1, name: "Tập sự", minYears: 0, minArticles: 0, bonus: 0 },
    { level: 2, name: "Chính thức", minYears: 1, minArticles: 50, bonus: 10 },
    { level: 3, name: "Chuyên gia", minYears: 3, minArticles: 300, bonus: 20 },
    { level: 4, name: "Cố vấn", minYears: 5, minArticles: 1000, bonus: 35 },
  ];

  const formatEarnings = (value) => {
    if (value >= 1000000) return (value / 1000000).toFixed(1) + "M";
    if (value >= 1000) return (value / 1000).toFixed(0) + "K";
    return value.toString();
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await articleService.getMyArticles();
        if (response.data) {
          const allData = response.data.data.data || [];
          const userRaw = response.data.user || {};

          // Lọc ra danh sách bài viết đã được duyệt để tính toán cấp bậc
          const approvedArticles = allData.filter(
            (art) => art.status === "published"
          );

          setArticles(allData);
          setUserData({
            name: userRaw.name || "Tác giả",
            years_of_experience: Number(userRaw.years_of_experience) || 0,
            approved_articles_count: approvedArticles.length,
          });

          const totals = allData.reduce(
            (acc, curr) => ({
              views: acc.views + (Number(curr.views) || 0),
              earnings: acc.earnings + (Number(curr.earnings) || 0),
              comments: acc.comments + (Number(curr.comment_count) || 0),
            }),
            { views: 0, earnings: 0, comments: 0 }
          );

          setStats({
            totalViews: totals.views.toLocaleString("vi-VN"),
            totalArticles:
              response.data.data.total?.toString() || allData.length.toString(),
            earnings: formatEarnings(totals.earnings),
            comments: totals.comments.toLocaleString("vi-VN"),
          });
        }
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const rankInfo = useMemo(() => {
    const current =
      [...RANKS]
        .reverse()
        .find(
          (r) =>
            userData.years_of_experience >= r.minYears &&
            userData.approved_articles_count >= r.minArticles
        ) || RANKS[0];

    const nextIndex = RANKS.findIndex((r) => r.level === current.level) + 1;
    const next = RANKS[nextIndex] || null;

    let progress = 100;
    if (next) {
      const needed = next.minArticles;
      const has = userData.approved_articles_count;
      progress = Math.min(Math.round((has / needed) * 100), 99);
    }

    return { current, next, progress };
  }, [userData]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Lượt xem của tôi",
            value: stats.totalViews,
            icon: Eye,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Bài viết của tôi",
            value: stats.totalArticles,
            icon: FileText,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "Nhuận bút",
            value: stats.earnings,
            icon: DollarSign,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "Thảo luận",
            value: stats.comments,
            icon: MessageSquare,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]"
          >
            <div
              className={`${s.bg} ${s.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}
            >
              <s.icon size={22} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {s.label}
            </p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
              {s.value}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden p-2">
          <div className="p-8 flex justify-between items-center">
            <h3 className="text-xl font-black tracking-tight uppercase italic">
              Nội dung vừa đăng
            </h3>
          </div>
          <div className="px-4 pb-4">
            {loading ? (
              <div className="py-20 flex justify-center">
                <Loader2 className="animate-spin text-slate-300" size={40} />
              </div>
            ) : (
              <div className="space-y-2">
                {articles.map((art) => (
                  <div
                    key={art.id}
                    className="flex items-center justify-between p-5 hover:bg-slate-50 rounded-[2rem] transition-all group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-rose-600 group-hover:text-white transition-all">
                        <FileText size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 line-clamp-1">
                          {art.title}
                        </h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                          {art.category?.name || "General"} •{" "}
                          {art.created_at_human || "Mới đây"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs font-black text-slate-900">
                          {art.views || 0}
                        </p>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">
                          Views
                        </p>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${
                          art.status === "published"
                            ? "bg-green-50 text-green-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {art.status === "published" ? "Live" : "Review"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-40 h-40 bg-rose-600/10 blur-3xl"></div>

          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/10">
              <Award className="text-rose-500" size={28} />
            </div>

            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-2">
              Cấp bậc tác giả
            </h4>
            <h3 className="text-2xl font-black uppercase tracking-tight mb-1">
              {rankInfo.current.name}
            </h3>
            <p className="text-slate-400 text-xs font-medium mb-8">
              Thâm niên: {userData.years_of_experience} năm •{" "}
              {userData.approved_articles_count} bài đã duyệt
            </p>

            <div className="space-y-6">
              {rankInfo.next ? (
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                    <span className="text-slate-400">
                      Tiến trình lên {rankInfo.next.name}
                    </span>
                    <span className="text-rose-500">{rankInfo.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-600 transition-all duration-1000 shadow-[0_0_10px_rgba(225,29,72,0.5)]"
                      style={{ width: `${rankInfo.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-[9px] text-slate-500 mt-2 italic">
                    Cần thêm:{" "}
                    {Math.max(
                      0,
                      rankInfo.next.minArticles -
                        userData.approved_articles_count
                    )}{" "}
                    bài đã duyệt &{" "}
                    {Math.max(
                      0,
                      rankInfo.next.minYears - userData.years_of_experience
                    ).toFixed(1)}{" "}
                    năm thâm niên
                  </p>
                </div>
              ) : (
                <div className="py-4 border border-dashed border-rose-500/30 rounded-2xl text-center">
                  <Star className="text-rose-500 mx-auto mb-2" size={20} />
                  <p className="text-[10px] font-black uppercase text-rose-500">
                    Cấp bậc tối đa
                  </p>
                </div>
              )}

              <div className="bg-white/5 p-5 rounded-[1.5rem] border border-white/5">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    className="text-emerald-400 shrink-0"
                    size={18}
                  />
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-wider text-slate-200">
                      Quyền lợi hiện tại
                    </p>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Hệ số nhuận bút:{" "}
                      <span className="text-white font-bold">
                        x{(1 + rankInfo.current.bonus / 100).toFixed(1)}
                      </span>
                      . Đã bao gồm thưởng cấp bậc.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="relative z-10 mt-10 w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-rose-500 hover:text-white transition-all duration-500 group flex items-center justify-center gap-2"
          >
            Bảng đặc quyền{" "}
            <TrendingUp
              size={14}
              className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
            />
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden relative animate-in zoom-in duration-300">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-3 bg-slate-50 text-slate-400 hover:text-rose-600 rounded-2xl transition-colors"
            >
              <X size={20} />
            </button>

            <div className="p-10">
              <div className="mb-8 text-center sm:text-left">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                  Cấp bậc & Đặc quyền
                </h3>
                <p className="text-slate-400 text-sm font-medium">
                  Lộ trình dựa trên thâm niên và số bài viết được phê duyệt
                </p>
              </div>

              <div className="space-y-4">
                {RANKS.map((r) => (
                  <div
                    key={r.level}
                    className={`p-6 rounded-[2rem] border transition-all ${
                      rankInfo.current.level === r.level
                        ? "border-rose-200 bg-rose-50/50 ring-1 ring-rose-200"
                        : "border-slate-100 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            rankInfo.current.level >= r.level
                              ? "bg-rose-600 text-white"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {rankInfo.current.level >= r.level ? (
                            <CheckCircle2 size={20} />
                          ) : (
                            <Award size={20} />
                          )}
                        </div>
                        <h4 className="font-black text-slate-800 uppercase text-sm">
                          {r.name}
                        </h4>
                      </div>
                      <span className="text-xs font-black text-rose-600">
                        Bonus: {r.bonus}%
                      </span>
                    </div>
                    <div className="pl-13 grid grid-cols-2 gap-4 mt-4">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">
                        Thâm niên:{" "}
                        <span className="text-slate-700">{r.minYears} Năm</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">
                        Bài được duyệt:{" "}
                        <span className="text-slate-700">
                          {r.minArticles} Bài
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full mt-10 bg-slate-900 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-rose-600 transition-all shadow-xl shadow-slate-200"
              >
                Tiếp tục viết bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
