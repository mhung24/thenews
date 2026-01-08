import React, { useState, useEffect } from "react";
import {
  Tags,
  LayoutGrid,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  X,
} from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast"; // Thêm dòng này

const CategoryTagManagement = () => {
  const [activeTab, setActiveTab] = useState("categories");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({ name: "" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/moderator/content-structure`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = response.data;
      if (data) {
        setCategories(data.categories || []);
        setTags(data.tags || []);
      }
    } catch (error) {
      console.error("LỖI KHI GỌI API:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setFormData({ name: item ? item.name : "" });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const isCategory = activeTab === "categories";

    const resourcePath = isCategory ? "categories" : "tags";
    const baseUrl = `${import.meta.env.VITE_API_URL}/${resourcePath}`;

    // Tạo hiệu ứng loading cho toast
    const loadingToast = toast.loading("Đang xử lý...");

    try {
      if (modalType === "add") {
        await axios.post(baseUrl, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Thêm thành công!", { id: loadingToast });
      } else if (modalType === "edit") {
        await axios.put(`${baseUrl}/${selectedItem.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Cập nhật thành công!", { id: loadingToast });
      } else if (modalType === "delete") {
        await axios.delete(`${baseUrl}/${selectedItem.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Đã xóa thành công!", { id: loadingToast });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Thao tác thất bại", {
        id: loadingToast,
      });
    }
  };

  const currentData = activeTab === "categories" ? categories : tags;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Thêm bộ phận hiển thị thông báo ở đây */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          {activeTab === "categories" ? (
            <LayoutGrid className="text-blue-600" />
          ) : (
            <Tags className="text-blue-600" />
          )}
          Quản lý {activeTab === "categories" ? "Chuyên mục" : "Thẻ tag"}
        </h1>
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("categories")}
          className={`pb-2 px-4 font-medium transition ${
            activeTab === "categories"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Chuyên mục
        </button>
        <button
          onClick={() => setActiveTab("tags")}
          className={`pb-2 px-4 font-medium transition ${
            activeTab === "tags"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Thẻ (Tags)
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-gray-500">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p>Đang tải dữ liệu từ hệ thống...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Tên</th>
                <th className="p-4 font-semibold text-gray-600">
                  Đường dẫn (Slug)
                </th>
                <th className="p-4 font-semibold text-gray-600 text-center">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-50 hover:bg-blue-50/30 transition"
                  >
                    <td className="p-4 font-medium text-gray-700">
                      {item.name}
                    </td>
                    <td className="p-4 text-gray-500 font-mono text-sm">
                      {item.slug}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleOpenModal("edit", item)}
                          className="text-blue-500 hover:text-blue-700 p-1 hover:bg-blue-100 rounded transition"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleOpenModal("delete", item)}
                          className="text-red-500 hover:text-red-700 p-1 hover:bg-red-100 rounded transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="p-8 text-center text-gray-400 italic"
                  >
                    Không có dữ liệu hiển thị trong database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {modalType === "add" && "Thêm mới"}
                {modalType === "edit" && "Chỉnh sửa"}
                {modalType === "delete" && "Xác nhận xóa"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {modalType !== "delete" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên {activeTab === "categories" ? "chuyên mục" : "thẻ"}
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Nhập tên..."
                      required
                    />
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">
                  Bạn có chắc chắn muốn xóa{" "}
                  <strong>{selectedItem?.name}</strong>? Thao tác này không thể
                  hoàn tác.
                </p>
              )}

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 text-white font-medium rounded-xl transition shadow-lg ${
                    modalType === "delete"
                      ? "bg-red-600 hover:bg-red-700 shadow-red-100"
                      : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"
                  }`}
                >
                  {modalType === "delete" ? "Xóa bỏ" : "Xác nhận"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryTagManagement;
