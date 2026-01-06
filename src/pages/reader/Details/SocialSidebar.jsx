import React from "react";
import {
  Facebook,
  Twitter,
  Link as LinkIcon,
  Bookmark,
  MessageSquare,
} from "lucide-react";
import axios from "axios";
import { notification } from "../../../utils/swal";

const handleCopyLink = () => {
  const url = window.location.href;
  navigator.clipboard
    .writeText(url)
    .then(() => {
      if (notification) {
        notification.success("Đã sao chép liên kết vào bộ nhớ tạm!");
      } else {
        alert("Đã sao chép liên kết!");
      }
    })
    .catch((err) => {
      console.error("Lỗi sao chép: ", err);
    });
};

const SocialSidebar = ({
  isBookmarked,
  setIsBookmarked,
  commentCount,
  articleId,
  setAuthMode,
}) => {
  const handleBookmark = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      notification.error("Vui lòng đăng nhập để lưu bài viết!");
      if (setAuthMode) setAuthMode("login");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/articles/${articleId}/bookmark`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status === 200) {
        setIsBookmarked(res.data.is_bookmarked);
        notification.success(res.data.message);
      }
    } catch (error) {
      console.error("Bookmark Error:", error);
      notification.error("Không thể thực hiện thao tác này");
    }
  };

  return (
    <div className="hidden lg:block lg:col-span-1">
      <div className="sticky top-24 flex flex-col gap-4 items-center">
        <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition shadow-sm">
          <Facebook size={18} />
        </button>
        <button className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition shadow-sm">
          <Twitter size={18} />
        </button>
        <button
          onClick={handleCopyLink}
          className="w-10 h-10 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center hover:bg-red-50 hover:text-red-700 transition-all shadow-sm border border-gray-100 group relative"
          title="Sao chép liên kết"
        >
          <LinkIcon size={18} />
          <span className="absolute left-full ml-3 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap font-bold uppercase italic">
            Sao chép link
          </span>
        </button>
        <div className="h-px w-6 bg-gray-200 my-2"></div>
        <button
          onClick={handleBookmark}
          className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 shadow-sm group relative ${
            isBookmarked
              ? "bg-red-700 text-white border-red-700"
              : "bg-white text-gray-400 border-gray-200 hover:text-red-700 hover:border-red-700"
          }`}
        >
          <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
          <span className="absolute left-full ml-3 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap font-bold uppercase italic">
            {isBookmarked ? "Bỏ lưu" : "Lưu bài viết"}
          </span>
        </button>
        <div className="w-10 h-10 rounded-full bg-white text-gray-400 border border-gray-200 flex items-center justify-center hover:text-red-700 hover:border-red-700 transition shadow-sm relative cursor-pointer">
          <MessageSquare size={18} />
          <span className="absolute -top-1 -right-1 bg-red-700 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
            {commentCount || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SocialSidebar;
