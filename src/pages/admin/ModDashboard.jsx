import React, { useState, useEffect } from "react";
import {
  Users,
  FileCheck,
  Clock,
  TrendingUp,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Loader2,
  ChevronDown,
} from "lucide-react";
import * as XLSX from "xlsx";
import { dashboardService } from "../../services/dashboardService";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";

const ModDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingCount: 0,
    approvedCount: 0,
    totalViews: "0",
  });
  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, pendingRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getPendingArticles(),
      ]);
      setStats({
        totalUsers: statsRes.data?.total_users || 0,
        pendingCount: statsRes.data?.pending_articles || 0,
        approvedCount: statsRes.data?.approved_articles || 0,
        totalViews: statsRes.data?.total_views || "0",
      });
      setPendingList(pendingRes.data?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExportChange = async (e) => {
    const period = e.target.value;
    if (!period) return;

    const periodMap = {
      day: "NGÀY",
      month: "THÁNG",
      quarter: "QUÝ",
      year: "NĂM",
    };
    setIsExporting(true);

    try {
      const res = await dashboardService.getReportData(period);
      const rawData = res.data?.data || [];

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Báo cáo");

      worksheet.mergeCells("A1:G1");
      const titleCell = worksheet.getCell("A1");
      titleCell.value = `BÁO CÁO KIỂM DUYỆT NỘI DUNG THEO ${periodMap[period]}`;
      titleCell.font = {
        name: "Arial",
        size: 16,
        bold: true,
        color: { argb: "FFFF0000" },
      };
      titleCell.alignment = { vertical: "middle", horizontal: "center" };

      worksheet.mergeCells("A2:G2");
      worksheet.getCell(
        "A2"
      ).value = `Thời gian xuất: ${new Date().toLocaleString("vi-VN")}`;
      worksheet.getCell("A2").alignment = { horizontal: "center" };

      const header = [
        "STT",
        "TIÊU ĐỀ BÀI VIẾT",
        "TÁC GIẢ",
        "CHUYÊN MỤC",
        "LƯỢT XEM",
        "NGÀY GỬI",
        "TRẠNG THÁI",
      ];
      const headerRow = worksheet.addRow(header);

      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF0F0F0" },
        };
        cell.font = { bold: true };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { vertical: "middle", horizontal: "center" };
      });

      rawData.forEach((item, index) => {
        const row = worksheet.addRow([
          index + 1,
          item.title,
          item.author?.name || "N/A",
          item.category?.name || "N/A",
          item.views || 0,
          new Date(item.created_at).toLocaleDateString("vi-VN"),
          item.status === "approved" ? "Đã duyệt" : "Chờ duyệt",
        ]);
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });

      worksheet.columns = [
        { width: 8 },
        { width: 50 },
        { width: 25 },
        { width: 20 },
        { width: 12 },
        { width: 18 },
        { width: 18 },
      ];

      const buffer = await workbook.xlsx.writeBuffer();
      const fileName = `BAO_CAO_${
        periodMap[period]
      }_${new Date().getTime()}.xlsx`;
      saveAs(new Blob([buffer]), fileName);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Không thể xuất file báo cáo.",
        confirmButtonColor: "#e11d48",
      });
    } finally {
      setIsExporting(false);
      e.target.value = "";
    }
  };

  const handleAction = async (id, type) => {
    const isApprove = type === "approve";

    const confirmResult = await Swal.fire({
      title: isApprove ? "Phê duyệt bài viết?" : "Từ chối bài viết?",
      text: isApprove
        ? "Bài viết này sẽ được xuất bản lên hệ thống."
        : "Vui lòng nhập lý do từ chối bài viết này:",
      icon: isApprove ? "question" : "warning",
      input: isApprove ? undefined : "textarea",
      inputPlaceholder: "Nhập lý do tại đây...",
      showCancelButton: true,
      confirmButtonColor: isApprove ? "#10b981" : "#e11d48",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: isApprove ? "Duyệt bài" : "Từ chối",
      cancelButtonText: "Hủy",
      preConfirm: (note) => {
        if (!isApprove && !note) {
          Swal.showValidationMessage("Bạn phải nhập lý do từ chối!");
        }
        return note;
      },
    });

    if (confirmResult.isConfirmed) {
      setActionLoading(id);
      try {
        const status = isApprove ? "published" : "rejected";
        const review_note = isApprove
          ? "Bài viết đã được duyệt."
          : confirmResult.value;

        await dashboardService.updateArticleStatus(id, {
          status: status,
          review_note: review_note,
        });

        await loadData();

        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: isApprove
            ? "Bài viết đã được đăng tải."
            : "Bài viết đã bị từ chối.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Lỗi cập nhật trạng thái:", error);
        Swal.fire({
          icon: "error",
          title: "Thất bại",
          text: "Có lỗi xảy ra khi cập nhật trạng thái bài viết.",
          confirmButtonColor: "#e11d48",
        });
      } finally {
        setActionLoading(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fafafa]">
        <Loader2 className="animate-spin text-rose-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#fafafa] min-h-screen font-sans">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
            Hệ thống kiểm duyệt
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Báo cáo dữ liệu thực tế từ database
          </p>
        </div>

        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-rose-500 transition-colors">
            {isExporting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Calendar size={16} />
            )}
          </div>
          <select
            onChange={handleExportChange}
            disabled={isExporting}
            className="appearance-none bg-white border border-slate-200 rounded-2xl pl-11 pr-12 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none focus:border-rose-200 focus:ring-4 focus:ring-rose-50 transition-all cursor-pointer shadow-sm disabled:opacity-50"
          >
            <option value="">
              {isExporting ? "Đang xử lý..." : "Xuất báo cáo"}
            </option>
            <option value="day">Hôm nay</option>
            <option value="month">Tháng này</option>
            <option value="quarter">Quý này</option>
            <option value="year">Năm nay</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
            <ChevronDown size={14} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="CTV Mới"
          value={stats.totalUsers}
          trend="+12%"
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          label="Bài chờ duyệt"
          value={stats.pendingCount}
          trend="Ưu tiên"
          icon={Clock}
          color="bg-amber-500"
        />
        <StatCard
          label="Bài đã đăng"
          value={stats.approvedCount}
          trend="+5.4%"
          icon={FileCheck}
          color="bg-emerald-500"
        />
        <StatCard
          label="Lượt đọc"
          value={stats.totalViews}
          trend="+20%"
          icon={TrendingUp}
          color="bg-rose-500"
        />
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h3 className="font-black text-slate-800 uppercase text-xs mb-6 flex items-center gap-2">
          <Clock size={18} className="text-rose-600" /> Danh sách chờ duyệt (
          {pendingList.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 text-[10px] font-black uppercase text-slate-400">
                <th className="pb-4 px-2">Nội dung bài viết</th>
                <th className="pb-4 text-right px-2">Thao tác nhanh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {pendingList.length > 0 ? (
                pendingList.map((post) => (
                  <tr
                    key={post.id}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-5 px-2">
                      <p className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-rose-600 transition-colors">
                        {post.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-bold text-slate-400">
                          {post.author?.name}
                        </span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        <span className="text-[10px] font-bold text-rose-500 uppercase">
                          {post.category?.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 text-right px-2">
                      <div className="flex justify-end gap-2">
                        <button
                          disabled={actionLoading === post.id}
                          onClick={() => handleAction(post.id, "approve")}
                          className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-50"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        <button
                          disabled={actionLoading === post.id}
                          onClick={() => handleAction(post.id, "reject")}
                          className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all disabled:opacity-50"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="2"
                    className="py-10 text-center text-slate-400 text-sm font-medium"
                  >
                    Hiện không có bài viết nào chờ duyệt.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, trend, color, icon: Icon }) => (
  <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-rose-100/20 transition-all">
    <div className="relative z-10">
      <div
        className={`w-10 h-10 ${color} text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-inherit`}
      >
        {Icon && <Icon size={20} />}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
        {label}
      </p>
      <div className="flex items-end justify-between">
        <h4 className="text-2xl font-black text-slate-800 tracking-tight">
          {value}
        </h4>
        <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
          {trend}
        </span>
      </div>
    </div>
    <div className="absolute -right-6 -bottom-6 text-slate-50 opacity-[0.03] group-hover:scale-110 transition-all duration-500">
      {Icon && <Icon size={120} />}
    </div>
  </div>
);

export default ModDashboard;
