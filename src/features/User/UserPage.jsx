import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  UserPlus,
  FileSpreadsheet,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
} from "lucide-react";
import { userService } from "../../services/userService";
import Swal from "sweetalert2";
import UserTable from "./UserTable";
import AddUserModal from "./AddUserModal";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [importMode, setImportMode] = useState("manual");
  const [userToEdit, setUserToEdit] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("author");
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
  });

  const fetchUsers = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = {
          page,
          search: searchTerm,
          role: roleFilter,
          limit: 10,
        };
        const response = await userService.getUsers(params);
        setUsers(response.data.data.data);
        setPagination({
          current_page: response.data.data.current_page,
          last_page: response.data.data.last_page,
          total: response.data.data.total,
          per_page: response.data.data.per_page,
        });
      } catch {
        Swal.fire("Lỗi", "Không thể tải danh sách người dùng", "error");
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, roleFilter]
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(1);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchUsers]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      fetchUsers(newPage);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa?",
      text: "Dữ liệu này sẽ không thể khôi phục!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Đồng ý xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await userService.delete(id);
        Swal.fire("Đã xóa!", "Người dùng đã được loại bỏ.", "success");
        fetchUsers(pagination.current_page);
      } catch {
        Swal.fire("Lỗi", "Thao tác thất bại", "error");
      }
    }
  };

  const handleEdit = (user) => {
    setUserToEdit(user);
    setImportMode("manual");
    setIsModalOpen(true);
  };

  const handleResetPassword = async (user) => {
    const result = await Swal.fire({
      title: "Reset mật khẩu?",
      text: `Mật khẩu của ${user.name} sẽ được đặt về mặc định (author@123)`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      confirmButtonText: "Xác nhận Reset",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await userService.resetPassword(user.id);
        Swal.fire(
          "Thành công",
          "Mật khẩu đã được cấp lại về mặc định",
          "success"
        );
      } catch {
        Swal.fire("Lỗi", "Không thể reset mật khẩu", "error");
      }
    }
  };

  const handleRoleChange = async (user) => {
    const isBanned = user.role === "banned";
    const newRole = isBanned ? "author" : "banned";
    const actionText = isBanned ? "Mở khóa" : "Khóa";

    const result = await Swal.fire({
      title: `${actionText} tài khoản?`,
      text: `Bạn có chắc chắn muốn ${actionText.toLowerCase()} người dùng ${
        user.name
      }?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isBanned ? "#10b981" : "#e11d48",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await userService.toggleRole(user.id, newRole);
        Swal.fire(
          "Thành công",
          `Đã ${actionText.toLowerCase()} người dùng thành công`,
          "success"
        );
        fetchUsers(pagination.current_page);
      } catch {
        Swal.fire("Lỗi", "Không thể cập nhật trạng thái", "error");
      }
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Thành viên
          </h1>
          <p className="text-slate-400 font-medium mt-1">
            Quản lý và phân quyền người dùng hệ thống
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setImportMode("excel");
              setUserToEdit(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3.5 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-xs hover:bg-emerald-100 transition-all shadow-sm shadow-emerald-100"
          >
            <FileSpreadsheet size={18} /> IMPORT EXCEL
          </button>
          <button
            onClick={() => {
              setImportMode("manual");
              setUserToEdit(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3.5 bg-rose-600 text-white rounded-2xl font-black text-xs hover:bg-rose-700 transition-all shadow-xl shadow-rose-100"
          >
            <UserPlus size={18} /> THÊM MỚI
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative group">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Tìm theo tên, email hoặc số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] outline-none focus:border-rose-200 focus:ring-4 focus:ring-rose-50 transition-all font-medium text-slate-600 shadow-sm"
          />
        </div>

        <div className="relative">
          <Filter
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
            size={18}
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] outline-none appearance-none font-bold text-slate-500 cursor-pointer focus:border-rose-200 shadow-sm"
          >
            <option value="author">Chỉ Tác giả (Authors)</option>
            <option value="admin">Quản trị viên</option>
            <option value="moderator">Kiểm duyệt viên</option>
            <option value="reader">Độc giả</option>
            <option value="banned">Đã bị khóa</option>
          </select>
        </div>

        <button
          onClick={() => {
            setSearchTerm("");
            setRoleFilter("author");
          }}
          className="flex items-center justify-center gap-2 py-4 bg-slate-100 text-slate-500 rounded-[1.5rem] font-black text-xs hover:bg-slate-200 transition-all"
        >
          <RefreshCcw size={18} /> LÀM MỚI
        </button>
      </div>

      <div className="relative">
        <UserTable
          userList={users}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onResetPass={handleResetPassword}
          onStatus={handleRoleChange}
          onRefresh={() => fetchUsers(pagination.current_page)}
        />
      </div>

      {!loading && users.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
          <p className="text-slate-400 text-sm font-medium">
            Hiển thị{" "}
            <span className="text-slate-700 font-bold">{users.length}</span>{" "}
            trên{" "}
            <span className="text-slate-700 font-bold">{pagination.total}</span>{" "}
            người dùng
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 disabled:opacity-30 hover:text-rose-500 transition-all shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>

            {[...Array(pagination.last_page)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`w-12 h-12 rounded-xl font-black text-xs transition-all ${
                  pagination.current_page === i + 1
                    ? "bg-rose-600 text-white shadow-lg shadow-rose-100"
                    : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
              className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 disabled:opacity-30 hover:text-rose-500 transition-all shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        importMode={importMode}
        onRefresh={() => fetchUsers(pagination.current_page)}
        userToEdit={userToEdit}
      />
    </div>
  );
};

export default UserPage;
