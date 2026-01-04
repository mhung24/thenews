import React from "react";
import {
  MoreVertical,
  Edit2,
  Trash2,
  Key,
  Ban,
  CheckCircle,
  Loader2,
} from "lucide-react";

const UserTable = ({
  userList,
  loading,
  onEdit,
  onDelete,
  onStatus,
  onResetPass,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-[2.5rem] p-20 flex flex-col items-center justify-center border border-slate-100">
        <Loader2 className="animate-spin text-rose-500 mb-4" size={40} />
        <p className="text-slate-400 font-bold">Đang tải danh sách...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50">
            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Thông tin thành viên
            </th>
            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Quyền hạn
            </th>
            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Trạng thái
            </th>
            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {userList.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-slate-50/30 transition-all group"
            >
              <td className="px-8 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-50 to-orange-50 flex items-center justify-center text-rose-500 font-black shadow-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-black text-slate-700">{user.name}</div>
                    <div className="text-xs text-slate-400 font-medium">
                      {user.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-8 py-5">
                <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase">
                  {user.role}
                </span>
              </td>
              <td className="px-8 py-5">
                {user.role === "banned" ? (
                  <div className="flex items-center gap-1.5 text-rose-500 font-bold text-xs">
                    <Ban size={14} /> Đang khóa
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-xs">
                    <CheckCircle size={14} /> Hoạt động
                  </div>
                )}
              </td>
              <td className="px-8 py-5 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <button
                    onClick={() => onEdit(user)}
                    className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 rounded-xl shadow-sm transition-all"
                    title="Chỉnh sửa"
                  >
                    <Edit2 size={16} />
                  </button>

                  <button
                    onClick={() => onResetPass(user)} // ĐÃ SỬA: Truyền nguyên object user
                    className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-amber-600 hover:border-amber-100 rounded-xl shadow-sm transition-all"
                    title="Cấp lại mật khẩu"
                  >
                    <Key size={16} />
                  </button>

                  <button
                    onClick={() => onStatus(user)}
                    className={`p-2.5 bg-white border border-slate-100 rounded-xl shadow-sm transition-all ${
                      user.role === "banned"
                        ? "text-emerald-400 hover:text-emerald-600 hover:border-emerald-100"
                        : "text-slate-400 hover:text-rose-600 hover:border-rose-100"
                    }`}
                    title={
                      user.role === "banned" ? "Mở khóa" : "Khóa tài khoản"
                    }
                  >
                    <Ban size={16} />
                  </button>

                  <button
                    onClick={() => onDelete(user.id)}
                    className="p-2.5 bg-rose-50 text-rose-400 hover:text-rose-600 rounded-xl transition-all"
                    title="Xóa người dùng"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {userList.length === 0 && (
        <div className="p-20 text-center text-slate-400 font-medium">
          Không tìm thấy người dùng nào.
        </div>
      )}
    </div>
  );
};

export default UserTable;
