import React, { useState } from "react";
import axios from "axios";
import { Send, Trash2, Edit2, X, Check } from "lucide-react";
import { notification } from "../../../utils/swal";

const CommentSection = ({
  articleId,
  comments: initialComments,
  setAuthMode,
}) => {
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!token) {
      notification.error("Vui lòng đăng nhập để bình luận");
      setAuthMode("login");
      return;
    }

    try {
      setSubmitting(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/articles/${articleId}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status === 200) {
        setComments([res.data.data, ...comments]);
        setNewComment("");
        notification.success(res.data.message);
      }
    } catch (error) {
      notification.error("Lỗi khi gửi bình luận");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bình luận này?")) return;

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/comments/${commentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.status === 200) {
        setComments(comments.filter((c) => c.id !== commentId));
        notification.success("Đã xóa bình luận");
      }
    } catch (error) {
      notification.error("Không thể xóa bình luận");
    }
  };

  const handleUpdate = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/comments/${commentId}`,
        { content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.status === 200) {
        setComments(
          comments.map((c) =>
            c.id === commentId ? { ...c, content: editContent } : c
          )
        );
        setEditingId(null);
        notification.success("Đã cập nhật bình luận");
      }
    } catch (error) {
      notification.error("Lỗi khi cập nhật");
    }
  };

  return (
    <section
      id="comments"
      className="bg-white rounded-[2.5rem] p-8 md:p-12 mt-16 shadow-[0_10px_50px_rgba(0,0,0,0.03)] border border-gray-50"
    >
      <h3 className="text-xl font-black mb-10 uppercase italic tracking-tight flex items-center gap-3">
        Ý KIẾN BẠN ĐỌC{" "}
        <span className="bg-red-700 text-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center shadow-lg shadow-red-200">
          {comments.length}
        </span>
      </h3>

      <div className="flex gap-5 mb-16">
        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 text-gray-300 italic shrink-0">
          {user ? user.name.charAt(0).toUpperCase() : "?"}
        </div>

        <form onSubmit={handleSubmit} className="flex-1 relative group">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="CHIA SẺ Ý KIẾN CỦA BẠN..."
            className="w-full p-8 pr-20 bg-gray-50/50 border-none rounded-[2rem] focus:ring-4 focus:ring-red-700/5 transition-all min-h-[120px] outline-none font-bold italic text-sm placeholder:text-gray-300 shadow-inner resize-none"
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="absolute bottom-6 right-6 bg-red-700 text-white p-4 rounded-2xl hover:bg-red-800 transition-all active:scale-90 shadow-xl shadow-red-900/20 disabled:opacity-50"
          >
            <Send size={20} className={submitting ? "animate-pulse" : ""} />
          </button>
        </form>
      </div>

      <div className="space-y-10">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-5 group">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center font-black text-red-700 text-xs uppercase italic shrink-0 border border-red-100">
              {comment.user?.name?.charAt(0)}
            </div>
            <div className="flex-1 border-b border-gray-50 pb-8 last:border-none">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="font-black text-gray-900 text-[11px] uppercase italic tracking-tighter">
                    {comment.user?.name}
                  </span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                    {new Date(comment.created_at).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                {user && user.id === comment.user_id && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingId(comment.id);
                        setEditContent(comment.content);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="p-1 text-gray-400 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              {editingId === comment.id ? (
                <div className="mt-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none text-sm italic font-medium"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                    <button
                      onClick={() => handleUpdate(comment.id)}
                      className="p-2 text-green-600 hover:text-green-700"
                    >
                      <Check size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 text-sm leading-relaxed font-medium italic">
                  {comment.content}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CommentSection;
