import React, { useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  ImageIcon,
  List,
  ListOrdered,
  Quote,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

const RichTextEditor = ({ editorRef, error, onInput }) => {
  const hiddenFileInput = useRef(null);

  const execCommand = (command, value = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      if (onInput) onInput();
    }
  };

  const handleInsertImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (editorRef.current) {
          editorRef.current.focus();
          const figureTag = `
            <figure style="margin: 1.5rem auto; text-align: center;">
              <img src="${event.target.result}" 
                   alt="content-img" 
                   style="max-width: 100%; height: auto; border-radius: 0.75rem; display: block; margin: 0 auto;" 
              />
              <figcaption style="margin-top: 0.75rem; font-style: italic; font-size: 0.875rem; color: #64748b; font-weight: 500;" contenteditable="true">
                Nhập ghi chú cho ảnh tại đây...
              </figcaption>
            </figure>
            <p><br></p>
          `;
          document.execCommand("insertHTML", false, figureTag);
          if (onInput) onInput();
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = null;
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = (e.originalEvent || e).clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    if (onInput) onInput();
  };

  return (
    <div
      className={`bg-white rounded-[2.5rem] border shadow-sm overflow-hidden flex flex-col transition-all ${
        error ? "border-red-500 shadow-red-100" : "border-red-50"
      }`}
    >
      {/* TOOLBAR NÂNG CẤP */}
      <div className="px-6 py-3 bg-gray-50/50 backdrop-blur-sm flex flex-wrap items-center gap-1 border-b border-gray-100 sticky top-0 z-10">
        {/* Định dạng chữ */}
        <button
          type="button"
          onClick={() => execCommand("bold")}
          className="p-2 hover:bg-white hover:text-red-600 rounded-xl transition-all"
          title="In đậm"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => execCommand("italic")}
          className="p-2 hover:bg-white hover:text-red-600 rounded-xl transition-all"
          title="In nghiêng"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => execCommand("underline")}
          className="p-2 hover:bg-white hover:text-red-600 rounded-xl transition-all"
          title="Gạch chân"
        >
          <Underline size={16} />
        </button>
        <button
          type="button"
          onClick={() => execCommand("formatBlock", "h2")}
          className="p-2 hover:bg-white hover:text-red-600 rounded-xl transition-all text-xs font-black"
          title="Tiêu đề"
        >
          <Heading2 size={16} />
        </button>

        <div className="w-px h-6 bg-gray-200 mx-2"></div>

        {/* Căn lề */}
        <button
          type="button"
          onClick={() => execCommand("justifyLeft")}
          className="p-2 hover:bg-white hover:text-red-600 rounded-xl transition-all"
          title="Căn trái"
        >
          <AlignLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => execCommand("justifyCenter")}
          className="p-2 hover:bg-white hover:text-red-600 rounded-xl transition-all"
          title="Căn giữa"
        >
          <AlignCenter size={16} />
        </button>
        <button
          type="button"
          onClick={() => execCommand("justifyRight")}
          className="p-2 hover:bg-white hover:text-red-600 rounded-xl transition-all"
          title="Căn phải"
        >
          <AlignRight size={16} />
        </button>

        <div className="w-px h-6 bg-gray-200 mx-2"></div>

        {/* Danh sách & Tiện ích */}
        <button
          type="button"
          onClick={() => execCommand("insertUnorderedList")}
          className="p-2 hover:bg-white hover:text-red-600 rounded-xl transition-all"
          title="Danh sách chấm"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => execCommand("insertOrderedList")}
          className="p-2 hover:bg-white hover:text-red-600 rounded-xl transition-all"
          title="Danh sách số"
        >
          <ListOrdered size={16} />
        </button>
        <button
          type="button"
          onClick={() => execCommand("formatBlock", "blockquote")}
          className="p-2 hover:bg-white hover:text-red-600 rounded-xl transition-all"
          title="Trích dẫn"
        >
          <Quote size={16} />
        </button>
        <button
          type="button"
          onClick={() => execCommand("insertHorizontalRule")}
          className="p-2 hover:bg-white hover:text-red-600 rounded-xl transition-all"
          title="Đường kẻ ngang"
        >
          <Minus size={16} />
        </button>

        <div className="w-px h-6 bg-gray-200 mx-2"></div>

        {/* Chèn ảnh */}
        <button
          type="button"
          onClick={() => hiddenFileInput.current.click()}
          className="flex items-center gap-2 px-3 py-2 hover:bg-white hover:text-red-600 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest"
        >
          <ImageIcon size={16} className="text-red-500" />
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

      <div
        className="editor-scrollbar overflow-y-auto"
        style={{ maxHeight: "600px" }}
      >
        <div
          ref={editorRef}
          contentEditable
          onInput={onInput}
          onPaste={handlePaste}
          className="min-h-[500px] p-10 outline-none prose prose-red prose-lg max-w-none font-serif leading-relaxed text-slate-700"
          suppressContentEditableWarning
          placeholder="Bắt đầu câu chuyện của bạn tại đây..."
        />
      </div>

      {error && (
        <div className="px-10 py-4 bg-red-50 border-t border-red-100 flex items-center gap-2 text-red-600 text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-bottom-2">
          <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
          ⚠️ Lỗi nội dung: {error}
        </div>
      )}

      <style>{`
        .editor-scrollbar::-webkit-scrollbar { width: 5px; }
        .editor-scrollbar::-webkit-scrollbar-thumb { background: #fee2e2; border-radius: 10px; }
        [contenteditable]:empty:before { content: attr(placeholder); color: #94a3b8; font-style: italic; }
        
        /* Style cho Blockquote trích dẫn */
        blockquote {
          border-left: 4px solid #e11d48;
          padding-left: 1.5rem;
          font-style: italic;
          color: #475569;
          margin: 1.5rem 0;
        }

        /* Style cho đường kẻ ngang */
        hr {
          border: none;
          border-top: 2px dashed #f1f5f9;
          margin: 2rem 0;
        }

        figcaption:focus { outline: none; background: #f8fafc; border-radius: 4px; }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
