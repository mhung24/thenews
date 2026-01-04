import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  ShieldAlert,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle,
  AlertCircle,
  Trash2,
  User,
  Clock,
  ExternalLink,
  ChevronDown,
  ArrowUpRight,
  ShieldCheck,
  Ban,
  Loader2,
} from "lucide-react";
import Swal from "sweetalert2";
import { reportService } from "../../../services/reportService";
import { userService } from "../../../services/userService"; // Import thêm userService

const ReportManager = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        status: activeTab !== "all" ? activeTab : undefined,
        search: searchQuery || undefined,
      };
      const res = await reportService.getAll(params);
      const incomingData = res.data?.data?.data || res.data?.data || res.data;
      setReports(Array.isArray(incomingData) ? incomingData : []);
    } catch {
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, searchQuery]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const stats = useMemo(
    () => ({
      total: reports.length,
      pending: reports.filter((r) => r.status === "Pending").length,
      resolved: reports.filter((r) => r.status === "Resolved").length,
    }),
    [reports]
  );

  const handleAction = async (reportId, status) => {
    const actionText = status === "Resolved" ? "Đã xử lý" : "Bác bỏ";
    const result = await Swal.fire({
      title: `Xác nhận ${actionText}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: status === "Resolved" ? "#0f172a" : "#64748b",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await reportService.updateStatus(reportId, {
          status,
          moderator_note: `Xử lý lúc ${new Date().toLocaleString()}`,
        });
        Swal.fire("Thành công", `Báo cáo đã được ${actionText}`, "success");
        setSelectedReport(null);
        fetchReports();
      } catch {
        Swal.fire("Lỗi", "Không thể cập nhật trạng thái", "error");
      }
    }
  };

  // Cập nhật hàm handleBan để set role thành banned
  const handleBan = async (report) => {
    const result = await Swal.fire({
      title: "Khóa tài khoản?",
      text: `Người dùng @${report.reported_user?.name} sẽ bị chuyển role sang Banned!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      confirmButtonText: "Xác nhận khóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        // 1. Cập nhật role của user bị báo cáo thành 'banned' thông qua userService
        await userService.toggleRole(report.reported_user_id, "banned");

        // 2. Tự động cập nhật trạng thái báo cáo này thành 'Resolved' để đánh dấu đã xử lý
        await reportService.updateStatus(report.id, {
          status: "Resolved",
          moderator_note: `Tài khoản đã bị khóa (Role: Banned) vào lúc ${new Date().toLocaleString()}`,
        });

        Swal.fire(
          "Đã khóa!",
          "Tài khoản đã bị vô hiệu hóa (Banned).",
          "success"
        );
        setSelectedReport(null);
        fetchReports();
      } catch {
        Swal.fire(
          "Lỗi",
          "Không thể thực hiện thao tác khóa tài khoản",
          "error"
        );
      }
    }
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case "Urgent":
        return "bg-red-100 text-red-700 border-red-200";
      case "High":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Medium":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex w-full font-sans">
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-bold text-slate-800">
            Quản lý báo cáo vi phạm
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Tìm User..."
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none w-64 focus:ring-2 focus:ring-indigo-500/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </header>

        <main className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-sm font-medium text-slate-500 mb-1">
                Tổng báo cáo
              </p>
              <span className="text-3xl font-black text-slate-900">
                {stats.total}
              </span>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-sm font-medium text-slate-500 mb-1">
                Chưa xử lý
              </p>
              <span className="text-3xl font-black text-amber-500">
                {stats.pending}
              </span>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-sm font-medium text-slate-500 mb-1">
                Đã giải quyết
              </p>
              <span className="text-3xl font-black text-emerald-500">
                {stats.resolved}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex gap-4">
              {["all", "Pending", "In Progress", "Resolved", "Dismissed"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-sm font-bold pb-1 transition-all px-2 ${
                      activeTab === tab
                        ? "text-indigo-600 border-b-2 border-indigo-600"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {tab === "all" ? "Tất cả" : tab}
                  </button>
                )
              )}
            </div>

            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-20 flex justify-center">
                  <Loader2 className="animate-spin text-indigo-600" />
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-50">
                      <th className="px-6 py-4">Mã / Thời gian</th>
                      <th className="px-6 py-4">Người bị báo cáo</th>
                      <th className="px-6 py-4">Loại vi phạm</th>
                      <th className="px-6 py-4">Ưu tiên</th>
                      <th className="px-6 py-4">Trạng thái</th>
                      <th className="px-6 py-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {reports.map((report) => (
                      <tr
                        key={report.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-bold text-sm text-slate-700">
                            RP-{report.id}
                          </div>
                          <div className="text-xs text-slate-400">
                            {new Date(report.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-slate-700">
                            @{report.reported_user?.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Bởi: {report.reporter?.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                            {report.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-1 rounded-full border ${getPriorityColor(
                              report.priority
                            )}`}
                          >
                            {report.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {report.status === "Resolved" ? (
                            <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                              <CheckCircle size={14} /> Đã xử lý
                            </span>
                          ) : report.status === "Dismissed" ? (
                            <span className="text-slate-400 text-xs font-bold">
                              Đã bác bỏ
                            </span>
                          ) : (
                            <span className="text-amber-500 text-xs font-bold">
                              Đang chờ
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedReport(report)}
                            className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>

      {selectedReport && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setSelectedReport(null)}
          />
          <div className="w-full max-w-lg bg-white h-full relative z-10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex flex-col">
                <h3 className="text-xl font-black text-slate-800">
                  Chi tiết RP-{selectedReport.id}
                </h3>
                {selectedReport.status !== "Pending" && (
                  <span
                    className={`text-xs font-bold ${
                      selectedReport.status === "Resolved"
                        ? "text-emerald-500"
                        : "text-slate-400"
                    }`}
                  >
                    Trạng thái:{" "}
                    {selectedReport.status === "Resolved"
                      ? "Đã xử lý xong"
                      : "Đã bác bỏ"}
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 hover:bg-slate-100 rounded-full"
              >
                <MoreHorizontal size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <section>
                <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-4">
                  Mô tả sự việc
                </h4>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm leading-relaxed text-slate-600">
                  {selectedReport.description}
                </div>
              </section>
              <section>
                <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-4">
                  Bằng chứng
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {selectedReport.evidence?.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      className="w-full h-32 object-cover rounded-xl border border-slate-200 hover:scale-[1.02] transition-transform cursor-pointer"
                      alt="Evidence"
                    />
                  ))}
                </div>
              </section>

              {selectedReport.moderator_note && (
                <section>
                  <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-4">
                    Ghi chú xử lý
                  </h4>
                  <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-sm text-indigo-700 italic">
                    {selectedReport.moderator_note}
                  </div>
                </section>
              )}
            </div>

            <div className="p-6 border-t border-slate-100">
              {selectedReport.status === "Pending" ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAction(selectedReport.id, "Dismissed")}
                    className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors"
                  >
                    <Trash2 size={16} /> Bác bỏ
                  </button>
                  <button
                    onClick={() => handleAction(selectedReport.id, "Resolved")}
                    className="flex items-center justify-center gap-2 py-3 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-colors"
                  >
                    <CheckCircle size={16} /> Đã xử lý
                  </button>
                  <button
                    onClick={() => handleBan(selectedReport)}
                    className="col-span-2 flex items-center justify-center gap-2 py-3 bg-red-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-red-100 hover:bg-red-700 transition-colors"
                  >
                    <Ban size={16} /> Khóa tài khoản vĩnh viễn (Banned)
                  </button>
                </div>
              ) : (
                <div className="w-full py-4 bg-slate-100 rounded-xl text-center text-slate-500 font-bold text-sm border border-dashed border-slate-300">
                  Báo cáo này đã được xử lý và không thể thay đổi
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportManager;
