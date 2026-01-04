import React, { useState, useMemo } from "react";
import {
  LayoutGrid,
  Tag as TagIcon,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Plus,
  Check,
  Search,
} from "lucide-react";

const EditorSidebar = ({
  wordCount,
  readTime,
  hasTitle,
  hasCover,
  hasContent,
  categories,
  selectedCategory,
  onCategoryChange,
  availableTags,
  selectedTags,
  onToggleTag,
  onAddTag,
  errors,
}) => {
  const [tagInput, setTagInput] = useState("");

  const filteredTags = useMemo(() => {
    return availableTags.filter((tag) =>
      tag.name.toLowerCase().includes(tagInput.toLowerCase())
    );
  }, [tagInput, availableTags]);

  const isExisting = availableTags.some(
    (t) => t.name.toLowerCase() === tagInput.toLowerCase().trim()
  );

  const handleAction = () => {
    if (!tagInput.trim()) return;
    if (isExisting) {
      const existingTag = availableTags.find(
        (t) => t.name.toLowerCase() === tagInput.toLowerCase().trim()
      );
      if (!selectedTags.includes(existingTag.id)) onToggleTag(existingTag.id);
    } else {
      onAddTag(tagInput.trim());
    }
    setTagInput("");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
      <div className="bg-white rounded-[2.5rem] p-8 border border-red-50 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-red-50 rounded-xl text-red-600 shadow-inner">
            <CheckCircle2 size={20} strokeWidth={3} />
          </div>
          <h3 className="font-black uppercase tracking-[0.15em] text-[11px] text-gray-400">
            Checklist
          </h3>
        </div>

        <div className="space-y-5">
          {[
            { label: "Tiêu đề", status: hasTitle },
            { label: "Ảnh bìa", status: hasCover },
            { label: "Nội dung", status: hasContent },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-700 ${
                    item.status
                      ? "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]"
                      : "bg-gray-100 border-2 border-gray-50"
                  }`}
                ></div>
                <span
                  className={`text-sm font-bold transition-colors ${
                    item.status ? "text-gray-900" : "text-gray-300"
                  }`}
                >
                  {item.label}
                </span>
              </div>
              <div
                className={`transition-all duration-500 transform ${
                  item.status ? "scale-100 opacity-100" : "scale-50 opacity-0"
                }`}
              >
                <div className="bg-green-50 p-1 rounded-lg">
                  <Check size={14} className="text-green-600" strokeWidth={4} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-gray-50 grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-400">
              <FileText size={14} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Số chữ
              </span>
            </div>
            <p className="text-2xl font-black text-gray-900 leading-none">
              {wordCount.toLocaleString()}
            </p>
          </div>
          <div className="space-y-2 border-l border-gray-50 pl-6">
            <div className="flex items-center gap-2 text-gray-400">
              <Clock size={14} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Phút
              </span>
            </div>
            <p className="text-2xl font-black text-gray-900 leading-none">
              {readTime}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 border border-red-50 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gray-50 rounded-xl text-gray-600">
            <LayoutGrid size={20} />
          </div>
          <h3 className="font-black uppercase tracking-widest text-[11px] text-gray-400">
            Chuyên mục
          </h3>
        </div>
        <div className="relative group">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full p-4 bg-gray-50/50 rounded-2xl border-2 border-transparent transition-all appearance-none outline-none font-bold text-sm focus:border-red-500 focus:bg-white focus:shadow-lg focus:shadow-red-50"
          >
            <option value="">Chọn danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300 group-hover:text-red-500 transition-colors">
            <ChevronRight size={18} className="rotate-90" />
          </div>
        </div>
        {errors.category_id && (
          <p className="mt-3 text-red-500 text-[10px] font-black uppercase tracking-widest px-2">
            ⚠️ {errors.category_id[0]}
          </p>
        )}
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 border border-red-50 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded-xl text-gray-600">
              <TagIcon size={20} />
            </div>
            <h3 className="font-black uppercase tracking-widest text-[11px] text-gray-400">
              Hashtags
            </h3>
          </div>
          <span className="text-[10px] font-black text-red-500 bg-red-50 px-3 py-1 rounded-full uppercase">
            {selectedTags.length} đã chọn
          </span>
        </div>
        <div className="relative mb-6">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAction()}
            placeholder="Tìm hoặc thêm hashtag..."
            className="w-full pl-12 pr-12 py-3.5 bg-gray-50/80 border-2 border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-red-500 transition-all placeholder:text-gray-300"
          />
          <button
            onClick={handleAction}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all shadow-md active:scale-90 ${
              isExisting ? "bg-green-500 text-white" : "bg-red-600 text-white"
            }`}
          >
            {isExisting ? (
              <Check size={18} strokeWidth={3} />
            ) : (
              <Plus size={18} strokeWidth={3} />
            )}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-red-100">
          {filteredTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => onToggleTag(tag.id)}
              className={`px-4 py-2 rounded-xl text-[11px] font-black transition-all duration-300 flex items-center gap-2 border-2 ${
                selectedTags.includes(tag.id)
                  ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-100 scale-105"
                  : "bg-white border-gray-50 text-gray-400 hover:border-red-200 hover:text-red-500"
              }`}
            >
              <span>#</span>
              {tag.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditorSidebar;
