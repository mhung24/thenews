import React, { useState, useRef, useEffect } from "react";
import {
  Loader2,
  Save,
  Send,
  RotateCcw,
  ArrowLeft,
  Plus,
  Check,
  X as CloseIcon,
  FolderPlus,
} from "lucide-react";
import { articleService } from "../../../services/articleService";
import { notification } from "../../../utils/swal";
import CoverImage from "../../../components/admin/Editor/CoverImage";
import RichTextEditor from "../../../components/admin/Editor/RichTextEditor";
import EditorSidebar from "../../../components/admin/Editor/EditorSidebar";
import { useNavigate, useParams } from "react-router-dom";
import { useNotifications } from "../../../hooks/useNotifications";
import { getImageUrl } from "../../../utils/imageHelper";

const CreateArticle = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    category_id: "",
  });
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [errors, setErrors] = useState({});
  const [stats, setStats] = useState({ wordCount: 0, readTime: 0 });

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const editorRef = useRef(null);
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const STORAGE_KEY = "vn_daily_draft";

  useEffect(() => {
    const fetchInitData = async () => {
      try {
        const [resCat, resTag] = await Promise.all([
          articleService.getCategories(),
          articleService.getTags(),
        ]);
        setCategories(resCat.data || []);
        setAvailableTags(resTag.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchInitData();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      const fetchArticleData = async () => {
        setIsLoading(true);
        try {
          const res = await articleService.get(id);
          const data = res.data.data || res.data;

          setFormData({
            title: data.title,
            summary: data.summary || "",
            category_id: data.category?.id || "",
          });

          if (data.tags) {
            setSelectedTags(data.tags.map((t) => t.id));
          }

          if (editorRef.current) {
            editorRef.current.innerHTML = data.content;

            handleEditorInput();
          }

          if (data.image_url) {
            setCoverImagePreview(getImageUrl(data.image_url));
          }
        } catch {
          notification.error("Không tìm thấy bài viết cần sửa.");
          navigate("/admin/articles");
        } finally {
          setIsLoading(false);
        }
      };
      fetchArticleData();
    } else {
      if (localStorage.getItem(STORAGE_KEY)) {
        setHasDraft(true);
      }
    }
  }, [id, navigate]);

  const handleEditorInput = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || "";
    const cleanText = text.replace(/[\s\n]+/g, " ").trim();
    const words = cleanText === "" ? 0 : cleanText.split(" ").length;

    setStats({
      wordCount: words,
      readTime: Math.ceil(words / 200) || (words > 0 ? 1 : 0),
    });
  };

  const handleRecoverDraft = () => {
    const savedDraft = localStorage.getItem(STORAGE_KEY);
    if (savedDraft) {
      const data = JSON.parse(savedDraft);
      setFormData({
        title: data.title,
        summary: data.summary,
        category_id: data.category_id,
      });
      if (editorRef.current) {
        editorRef.current.innerHTML = data.content;
        setTimeout(handleEditorInput, 0);
      }
      setSelectedTags(data.tags || []);
      notification.success("Đã khôi phục bản nháp!");
      setHasDraft(false);
    }
  };

  const handleAddTag = async (tagName) => {
    try {
      const res = await articleService.createTag({ name: tagName });
      const newTag = res.data.data || res.data;
      setAvailableTags((prev) => [newTag, ...prev]);
      setSelectedTags((prev) => [...prev, newTag.id]);
      notification.success(`Đã tạo tag: #${tagName}`);
    } catch {
      notification.error("Lỗi khi tạo hashtag mới.");
    }
  };

  const handleQuickAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setIsCreatingCategory(true);
    try {
      const res = await articleService.createCategory({
        name: newCategoryName.trim(),
      });
      const newCat = res.data.data || res.data;

      setCategories((prev) => [newCat, ...prev]);
      setFormData((prev) => ({ ...prev, category_id: newCat.id }));

      setNewCategoryName("");
      setIsAddingCategory(false);
      notification.success(`Đã tạo danh mục: ${newCat.name}`);
    } catch {
      notification.error("Danh mục đã tồn tại hoặc có lỗi xảy ra.");
    } finally {
      setIsCreatingCategory(false);
    }
  };

  useEffect(() => {
    if (isEditMode) return;

    const timer = setInterval(() => {
      if (
        formData.title ||
        (editorRef.current && editorRef.current.innerText.trim() !== "")
      ) {
        const draftData = {
          title: formData.title,
          summary: formData.summary,
          category_id: formData.category_id,
          content: editorRef.current?.innerHTML || "",
          tags: selectedTags,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draftData));

        if (hasDraft) setHasDraft(false);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [formData, selectedTags, hasDraft, isEditMode]);

  const handleFileSelect = (file) => {
    setCoverImageFile(file);
    setCoverImagePreview(URL.createObjectURL(file));
  };

  const toggleTag = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Tiêu đề không được để trống";
    if (formData.title.trim().length < 10)
      newErrors.title = "Tiêu đề phải có ít nhất 10 ký tự";
    if (!formData.category_id)
      newErrors.category_id = "Vui lòng chọn danh mục cho bài viết";
    if (stats.wordCount < 50)
      newErrors.content = "Nội dung bài viết quá ngắn (tối thiểu 50 từ)";

    if (!coverImagePreview) {
      notification.warning("Gợi ý: Thêm ảnh bìa để bài viết thu hút hơn");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (statusType) => {
    if (!validateForm()) {
      notification.error("Vui lòng kiểm tra lại thông tin bài viết");
      return;
    }

    setIsLoading(true);
    try {
      let finalImageUrl = "";

      if (coverImageFile) {
        const formDataImage = new FormData();
        formDataImage.append("file", coverImageFile);
        const resUpload = await articleService.uploadImage(formDataImage);

        if (resUpload.data?.status === 422) {
          notification.error(resUpload.data.message);
          setIsLoading(false);
          return;
        }

        if (resUpload.data?.data?.url) {
          finalImageUrl = resUpload.data.data.url;
        }
      } else if (isEditMode && coverImagePreview) {
        if (coverImagePreview.includes("/storage/")) {
          const relativePath = coverImagePreview
            .split(import.meta.env.VITE_BACKEND_URL)
            .pop();
          finalImageUrl = relativePath;
        }
      }

      const payload = {
        title: formData.title,
        summary: formData.summary,
        category_id: formData.category_id,
        content: editorRef.current.innerHTML,
        tags: selectedTags,
        status: statusType,
      };

      if (finalImageUrl) {
        payload.image_url = finalImageUrl;
      }

      if (isEditMode) {
        await articleService.update(id, payload);
      } else {
        await articleService.create(payload);
      }

      addNotification({
        title: isEditMode ? "Cập nhật thành công" : "Đã gửi bài viết",
        message: `Bài viết "${formData.title}" đã được lưu.`,
        type: "success",
      });

      notification.success("Thao tác thành công!");
      if (!isEditMode) localStorage.removeItem(STORAGE_KEY);
      navigate("/admin");
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        notification.error("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500 pb-20 font-sans">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/articles")}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            {isEditMode ? "EDIT MODE" : "CREATE MODE"}
          </span>
          {!isEditMode && hasDraft && (
            <button
              onClick={handleRecoverDraft}
              className="flex items-center gap-2 px-4 py-1.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-full font-bold text-[10px] hover:bg-amber-100 transition-all"
            >
              <RotateCcw size={12} /> <span>Khôi phục bản nháp?</span>
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSubmit("pending")}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-xl font-bold text-xs hover:bg-red-700 transition-all shadow-lg shadow-red-100 disabled:opacity-50"
          >
            <span>{isEditMode ? "Cập nhật bài viết" : "Gửi bài duyệt"}</span>
            <Send size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8 w-full">
          <div
            className={`bg-white p-10 rounded-[2.5rem] border shadow-sm w-full transition-all ${
              errors.title
                ? "border-red-200 ring-1 ring-red-100"
                : "border-slate-100"
            }`}
          >
            <input
              placeholder="Tiêu đề bài viết..."
              className="w-full text-3xl font-black outline-none font-serif placeholder:text-gray-200 bg-transparent"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: null });
              }}
            />
            {errors.title && (
              <p className="text-red-500 text-[10px] mt-2 font-bold uppercase tracking-widest">
                {errors.title}
              </p>
            )}
            <div className="h-px bg-gray-50 my-6"></div>
            <textarea
              placeholder="Sapo bài viết (Tóm tắt ngắn)..."
              className="w-full text-lg italic text-gray-500 outline-none resize-none font-serif leading-relaxed bg-transparent"
              rows={2}
              value={formData.summary}
              onChange={(e) =>
                setFormData({ ...formData, summary: e.target.value })
              }
            />
          </div>

          <RichTextEditor
            editorRef={editorRef}
            onInput={handleEditorInput}
            error={errors.content}
          />
        </div>

        <div className="lg:col-span-4 space-y-6 sticky top-6 w-full">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
              Ảnh bìa bài viết
            </p>
            <CoverImage
              preview={coverImagePreview}
              onFileSelect={handleFileSelect}
            />
            {errors.image_url && (
              <p className="text-red-500 text-[10px] mt-2 font-bold">
                {errors.image_url[0]}
              </p>
            )}
          </div>

          <div
            className={`bg-white rounded-[2rem] border shadow-sm overflow-hidden transition-all ${
              errors.category_id
                ? "border-red-200 ring-1 ring-red-100"
                : "border-slate-100"
            }`}
          >
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <FolderPlus size={14} className="text-red-500" /> Cấu hình danh
                mục
              </p>
              <button
                onClick={() => {
                  setIsAddingCategory(!isAddingCategory);
                  setNewCategoryName("");
                }}
                className={`p-1.5 rounded-lg transition-all ${
                  isAddingCategory
                    ? "bg-red-600 text-white rotate-0"
                    : "bg-white border border-slate-100 text-red-600 hover:bg-red-50"
                }`}
              >
                {isAddingCategory ? (
                  <CloseIcon size={14} />
                ) : (
                  <Plus size={14} />
                )}
              </button>
            </div>

            <div className="p-6 space-y-4">
              {isAddingCategory && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-300 bg-red-50/50 p-4 rounded-2xl border border-red-100/50">
                  <p className="text-[9px] font-bold text-red-500 uppercase">
                    Tạo danh mục mới
                  </p>
                  <div className="flex gap-2">
                    <input
                      autoFocus
                      placeholder="Nhập tên..."
                      className="flex-1 px-4 py-2.5 bg-white border border-red-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-100 transition-all font-medium"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleQuickAddCategory()
                      }
                    />
                    <button
                      disabled={isCreatingCategory || !newCategoryName.trim()}
                      onClick={handleQuickAddCategory}
                      className="px-4 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors shadow-lg shadow-red-100 flex items-center justify-center min-w-[44px]"
                    >
                      {isCreatingCategory ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Check size={16} />
                      )}
                    </button>
                  </div>
                </div>
              )}

              <EditorSidebar
                wordCount={stats.wordCount}
                readTime={stats.readTime}
                hasTitle={formData.title.trim().length > 5}
                hasCover={coverImagePreview !== null}
                hasContent={stats.wordCount > 10}
                categories={categories}
                selectedCategory={formData.category_id}
                onCategoryChange={(val) => {
                  setFormData({ ...formData, category_id: val });
                  if (errors.category_id)
                    setErrors({ ...errors, category_id: null });
                }}
                availableTags={availableTags}
                selectedTags={selectedTags}
                onToggleTag={toggleTag}
                onAddTag={handleAddTag}
                errors={errors}
                hideTitleSection={true}
              />
              {errors.category_id && (
                <p className="text-red-500 text-[9px] font-bold uppercase tracking-wider">
                  {errors.category_id}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-4 max-w-xs w-full mx-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-red-100 rounded-full"></div>
              <Loader2 className="w-16 h-16 text-red-600 animate-spin absolute top-0 left-0" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-black text-slate-900 mb-1">
                {isEditMode ? "Đang cập nhật..." : "Đang gửi bài..."}
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Hệ thống đang xử lý nội dung của bạn.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateArticle;
