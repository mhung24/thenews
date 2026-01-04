import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MessageSquare,
  Search,
  Calendar,
  Loader2,
  X,
} from "lucide-react";
import { dashboardService } from "../../../services/dashboardService";

const ModStatistics = () => {
  const [timeRange, setTimeRange] = useState("7days");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState({
    stats: {
      approved_total: "0",
      rejected_total: "0",
      pending_total: "0",
      reports_total: "0",
    },
    monthly_performance: [],
    top_authors: [],
  });

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.getStatistics(timeRange);
      setData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
        <Loader2 className="animate-spin text-rose-600" size={40} />
      </div>
    );
  }

  const statCards = [
    {
      label: "Tổng tin đã duyệt",
      value: data.stats.approved_total,
      change: "+12.5%",
      icon: <CheckCircle2 className="text-emerald-500" />,
      trend: "up",
    },
    {
      label: "Tin bị từ chối",
      value: data.stats.rejected_total,
      change: "-3.2%",
      icon: <XCircle className="text-rose-500" />,
      trend: "down",
    },
    {
      label: "Tin chờ xử lý",
      value: data.stats.pending_total,
      change: "Mới",
      icon: <Clock className="text-amber-500" />,
      trend: "neutral",
    },
    {
      label: "Báo cáo vi phạm",
      value: data.stats.reports_total,
      change: "0",
      icon: <AlertTriangle className="text-orange-500" />,
      trend: "neutral",
    },
  ];

  const maxVal = Math.max(
    ...data.monthly_performance.map((m) => m.approved + m.rejected),
    1
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
            Thống Kê Hệ Thống
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Dữ liệu phân tích thực tế từ Database
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
          {["24h", "7days", "30days"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                timeRange === range
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-400 hover:bg-slate-50"
              }`}
            >
              {range === "24h"
                ? "24 Giờ"
                : range === "7days"
                ? "7 Ngày"
                : "30 Ngày"}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-50 rounded-2xl">{item.icon}</div>
                <span
                  className={`flex items-center text-[10px] font-bold px-2 py-1 rounded-lg ${
                    item.trend === "up"
                      ? "bg-emerald-50 text-emerald-600"
                      : item.trend === "down"
                      ? "bg-rose-50 text-rose-600"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {item.change}
                </span>
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                {item.label}
              </p>
              <h3 className="text-3xl font-black text-slate-800 mt-1 tracking-tighter">
                {item.value}
              </h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                  Hiệu suất nội dung {new Date().getFullYear()}
                </h3>
                <p className="text-slate-400 text-[11px] font-medium">
                  Số lượng bài duyệt và từ chối theo tháng
                </p>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" /> Duyệt
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-rose-300" /> Từ Chối
                </div>
              </div>
            </div>

            <div className="h-64 flex items-end justify-between gap-3 px-2">
              {data.monthly_performance.map((month, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-2 group relative"
                >
                  <div className="w-full bg-slate-50 rounded-t-xl relative flex flex-col justify-end overflow-hidden h-48">
                    <div
                      className="w-full bg-emerald-400 rounded-t-xl transition-all duration-700"
                      style={{ height: `${(month.approved / maxVal) * 100}%` }}
                    />
                    <div
                      className="w-full bg-rose-300/60 transition-all duration-700"
                      style={{ height: `${(month.rejected / maxVal) * 100}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-300 font-black uppercase">
                    T{i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                Tác giả tiêu biểu
              </h3>
              <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-1 rounded-lg">
                TOP {data.top_authors.length}
              </span>
            </div>
            <div className="space-y-6">
              {data.top_authors.length > 0 ? (
                data.top_authors.map((author, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 group-hover:border-rose-200 transition-all">
                        <img
                          src={
                            author.avatar ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.name}`
                          }
                          alt={author.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 group-hover:text-rose-600 transition-colors">
                          {author.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-[10px] text-slate-400 font-bold uppercase">
                            {author.articles_count || author.articles} Bài viết
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-700">
                        {author.accuracy || "100%"}
                      </p>
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg ${
                          author.status === "Tốt" || author.articles_count > 5
                            ? "bg-emerald-50 text-emerald-500"
                            : "bg-amber-50 text-amber-500"
                        }`}
                      >
                        {author.status || "Hoạt động"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-slate-400 text-xs font-medium border border-dashed border-slate-100 rounded-2xl">
                  Chưa có dữ liệu tác giả
                </div>
              )}
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full mt-8 py-4 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 transition-all flex items-center justify-center gap-2"
            >
              Xem chi tiết <TrendingUp size={14} />
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl max-h-[80vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                  Xếp hạng tác giả chi tiết
                </h3>
                <p className="text-slate-400 text-xs font-bold uppercase mt-1">
                  Dữ liệu tổng hợp từ hệ thống
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-3 bg-slate-50 text-slate-400 hover:text-rose-600 rounded-2xl transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-50">
                    <th className="pb-4">Hạng</th>
                    <th className="pb-4">Tác giả</th>
                    <th className="pb-4 text-center">Tổng bài</th>
                    <th className="pb-4 text-center">Tỷ lệ duyệt</th>
                    <th className="pb-4 text-right">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.top_authors.map((author, i) => (
                    <tr
                      key={i}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-4 font-black text-slate-300">
                        #{i + 1}
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 overflow-hidden">
                            <img
                              src={
                                author.avatar ||
                                `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.name}`
                              }
                              alt=""
                            />
                          </div>
                          <span className="text-sm font-bold text-slate-700">
                            {author.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-center text-sm font-bold text-slate-600">
                        {author.articles_count || author.articles}
                      </td>
                      <td className="py-4 text-center">
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full mx-auto overflow-hidden mb-1">
                          <div
                            className="h-full bg-rose-500"
                            style={{ width: author.accuracy || "100%" }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-black text-slate-400">
                          {author.accuracy || "100%"}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <span
                          className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase ${
                            author.status === "Tốt" || author.articles_count > 5
                              ? "bg-emerald-50 text-emerald-500"
                              : "bg-amber-50 text-amber-500"
                          }`}
                        >
                          {author.status || "Hoạt động"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModStatistics;
