import React, { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  Key,
  FileSpreadsheet,
  Download,
  Briefcase,
} from "lucide-react";
import { userService } from "../../services/userService";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

const AddUserModal = ({
  isOpen,
  onClose,
  importMode,
  onRefresh,
  userToEdit,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    role: "author",
    password: "author@123",
    years_of_experience: 0,
  });
  const [excelData, setExcelData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        name: userToEdit.name || "",
        phone: userToEdit.phone || "",
        email: userToEdit.email || "",
        role: userToEdit.role || "author",
        password: "",
        years_of_experience: userToEdit.years_of_experience || 0,
      });
    } else {
      setFormData({
        name: "",
        phone: "",
        email: "",
        role: "author",
        password: "author@123",
        years_of_experience: 0,
      });
    }
    setExcelData([]);
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "years_of_experience" ? parseInt(value) || 0 : value,
    }));
  };

  const handleDownloadTemplate = () => {
    const data = [
      {
        name: "Nguyễn Văn A",
        email: "nguyenvana@gmail.com",
        phone: "0987654321",
        location: "Hà Nội",
        role: "author",
        years_of_experience: 5,
      },
      {
        name: "Trần Thị B",
        email: "tranthib@gmail.com",
        phone: "0912345678",
        location: "TP. Hồ Chí Minh",
        role: "author",
        years_of_experience: 0,
      },
    ];
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, "Mau_Import_Nguoi_Dung.xlsx");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      const validatedData = data.filter((item, index) => {
        if (!item.email || !validateEmail(item.email)) {
          console.warn(`Dòng ${index + 2}: Email không hợp lệ bỏ qua.`);
          return false;
        }
        // Đảm bảo years_of_experience là số
        item.years_of_experience = parseInt(item.years_of_experience) || 0;
        return true;
      });

      setExcelData(validatedData);
      if (validatedData.length < data.length) {
        Swal.fire(
          "Lưu ý",
          `Đã lọc bỏ ${
            data.length - validatedData.length
          } dòng có email không hợp lệ.`,
          "warning"
        );
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (importMode === "manual") {
        if (!formData.name || !formData.email) {
          setLoading(false);
          return Swal.fire(
            "Lỗi",
            "Vui lòng điền đầy đủ Họ tên và Email",
            "error"
          );
        }
        if (!validateEmail(formData.email)) {
          setLoading(false);
          return Swal.fire("Lỗi", "Định dạng Email không hợp lệ", "error");
        }

        const submitData = { ...formData };
        if (userToEdit && !submitData.password) {
          delete submitData.password;
        }

        if (userToEdit) {
          await userService.update(userToEdit.id, submitData);
          Swal.fire("Thành công", "Đã cập nhật thông tin", "success");
        } else {
          await userService.create(submitData);
          Swal.fire("Thành công", "Đã thêm người dùng mới", "success");
        }
      } else {
        if (excelData.length === 0) {
          setLoading(false);
          return Swal.fire(
            "Lỗi",
            "Vui lòng chọn file Excel có dữ liệu hợp lệ",
            "error"
          );
        }
        const res = await userService.importExcel(excelData);
        Swal.fire("Hoàn tất", res.data.message, "success");
      }

      if (onRefresh) onRefresh();
      onClose();
    } catch (error) {
      Swal.fire(
        "Lỗi",
        error.response?.data?.message || "Thao tác thất bại",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
        <div className="p-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-black text-slate-900">
                {userToEdit
                  ? "Sửa thông tin"
                  : importMode === "manual"
                  ? "Thêm User mới"
                  : "Import từ Excel"}
              </h2>
              <p className="text-slate-400 font-medium">
                {importMode === "manual"
                  ? "Cập nhật hoặc tạo tài khoản hệ thống."
                  : "Tải tệp danh sách định dạng .xlsx."}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {importMode === "manual" ? (
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Họ tên
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-rose-300 font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-rose-300 font-bold"
                />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-rose-300 font-bold"
                />
              </div>

              {/* TRƯỜNG KINH NGHIỆM MỚI */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                  Số năm kinh nghiệm
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="years_of_experience"
                    min="0"
                    value={formData.years_of_experience}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-rose-300 font-bold pl-12"
                  />
                  <Briefcase
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Quyền
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-rose-50 border border-rose-100 rounded-2xl font-black text-rose-600 outline-none appearance-none cursor-pointer"
                >
                  <option value="reader">READER</option>
                  <option value="author">AUTHOR</option>
                  <option value="moderator">MODERATOR</option>
                  <option value="admin">ADMIN</option>
                </select>
              </div>

              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  {userToEdit
                    ? "Mật khẩu (để trống nếu giữ nguyên)"
                    : "Mật khẩu mặc định"}
                </label>
                <div className="w-full px-5 py-4 bg-rose-50/50 border border-rose-100 rounded-2xl font-black text-rose-600 flex items-center gap-2">
                  <Key size={16} /> {userToEdit ? "••••••••" : "author@123"}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <label className="border-2 border-dashed border-rose-100 bg-rose-50/30 rounded-[2rem] p-12 text-center group hover:border-rose-300 cursor-pointer block transition-all">
                <input
                  type="file"
                  className="hidden"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                />
                <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <FileSpreadsheet
                    className={
                      excelData.length > 0
                        ? "text-rose-500"
                        : "text-emerald-500"
                    }
                    size={40}
                  />
                </div>
                <h3 className="font-black text-slate-700 text-lg">
                  {excelData.length > 0
                    ? `Đã nhận ${excelData.length} dòng dữ liệu`
                    : "Chọn file Excel"}
                </h3>
                {/* <p className="text-slate-400 text-sm mt-2 font-medium">
                  File phải chứa cột "years_of_experience" để cập nhật thâm niên
                </p> */}
              </label>
              <button
                onClick={handleDownloadTemplate}
                className="w-full py-4 border-2 border-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Download size={18} /> Tải file mẫu
              </button>
            </div>
          )}

          <div className="mt-8 flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-xs hover:bg-slate-200 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`flex-[2] py-4 rounded-2xl font-black uppercase text-xs text-white shadow-xl transition-all ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              } ${
                importMode === "manual"
                  ? "bg-rose-600 shadow-rose-100 hover:bg-rose-700"
                  : "bg-emerald-600 shadow-emerald-100 hover:bg-emerald-700"
              }`}
            >
              {loading
                ? "Đang xử lý..."
                : userToEdit
                ? "Cập nhật"
                : importMode === "manual"
                ? "Xác nhận"
                : "Bắt đầu Import"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
