import React, { useRef } from "react";
import { Bold, Italic, Heading2, ImageIcon, List } from "lucide-react";

// Đã thêm prop onInput vào đây để nhận hàm đếm từ cha
const RichTextEditor = ({ editorRef, error, onInput }) => {
  const hiddenFileInput = useRef(null);

  // Hàm thực thi các lệnh định dạng văn bản
  const execCommand = (command, value = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      // Gọi onInput thủ công để cập nhật lại state sau khi format
      if (onInput) onInput();
    }
  };

  // Xử lý chèn ảnh vào nội dung
  const handleInsertImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (editorRef.current) {
          editorRef.current.focus();

          // Tạo chuỗi HTML cho ảnh
          const imgTag = `<img src="${event.target.result}" 
                               alt="content-img" 
                               style="max-width: 100%; height: auto; border-radius: 0.75rem; margin: 1.5rem auto; display: block;" 
                          />`;

          // 1. Chèn ảnh vào vị trí con trỏ
          document.execCommand("insertHTML", false, imgTag);

          // 2. Chèn thêm dòng trống để gõ tiếp
          document.execCommand("insertHTML", false, "<p><br></p>");

          // Cập nhật lại nội dung cho cha biết
          if (onInput) onInput();
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    e.target.value = null;
  };

  return (
    <div
      className={`bg-white rounded-[2.5rem] border shadow-sm overflow-hidden flex flex-col transition-all ${
        error ? "border-red-500 shadow-red-100" : "border-red-50"
      }`}
    >
      {/* TOOLBAR */}
      <div className="px-6 py-3 bg-gray-50/50 backdrop-blur-sm flex items-center gap-1 border-b border-gray-100 sticky top-0 z-10">
        <button
          type="button"
          onClick={() => execCommand("bold")}
          className="p-2 hover:bg-white hover:text-red-600 rounded-xl transition-all"
          title="In đậm (Ctrl+B)"
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => execCommand("italic")}
          className="p-2 hover:bg-white hover:text-red-600 rounded-xl transition-all"
          title="In nghiêng (Ctrl+I)"
        >
          <Italic size={18} />
        </button>
        <button
          type="button"
          onClick={() => execCommand("formatBlock", "h2")}
          className="p-2 hover:bg-white hover:text-red-600 rounded-xl transition-all text-xs font-black"
          title="Tiêu đề H2"
        >
          <Heading2 size={18} />
        </button>

        <div className="w-px h-6 bg-gray-200 mx-2"></div>

        <button
          type="button"
          onClick={() => execCommand("insertUnorderedList")}
          className="p-2 hover:bg-white hover:text-red-600 rounded-xl transition-all"
          title="Danh sách"
        >
          <List size={18} />
        </button>

        <div className="w-px h-6 bg-gray-200 mx-2"></div>

        {/* NÚT CHÈN ẢNH */}
        <button
          type="button"
          onClick={() => hiddenFileInput.current.click()}
          className="flex items-center gap-2 px-3 py-2 hover:bg-white hover:text-red-600 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest"
        >
          <ImageIcon size={18} className="text-red-500" />
          <span>Chèn ảnh</span>
        </button>

        <input
          type="file"
          ref={hiddenFileInput}
          onChange={handleInsertImage}
          className="hidden"
          accept="image/*"
        />
      </div>

      {/* VÙNG SOẠN THẢO */}
      <div
        className="editor-scrollbar overflow-y-auto"
        style={{ maxHeight: "600px" }}
      >
        <div
          ref={editorRef}
          contentEditable
          onInput={onInput} // <-- QUAN TRỌNG: Dòng này giúp đếm chữ hoạt động
          className="min-h-[500px] p-10 outline-none prose prose-red prose-lg max-w-none font-serif leading-relaxed text-slate-700"
          suppressContentEditableWarning
          placeholder="Bắt đầu câu chuyện của bạn tại đây..."
        />
      </div>

      {/* THÔNG BÁO LỖI */}
      {error && (
        <div className="px-10 py-4 bg-red-50 border-t border-red-100 flex items-center gap-2 text-red-600 text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-bottom-2">
          <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
          ⚠️ Lỗi nội dung: {error}
        </div>
      )}

      <style>{`
        .editor-scrollbar::-webkit-scrollbar {
            width: 5px;
        }
        .editor-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .editor-scrollbar::-webkit-scrollbar-thumb {
            background: #fee2e2;
            border-radius: 10px;
        }
        .editor-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #fca5a5;
        }
        [contenteditable]:empty:before {
            content: attr(placeholder);
            color: #94a3b8;
            font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
