import React, { useRef } from "react";
import { ImagePlus, ImageIcon } from "lucide-react";

const CoverImage = ({ preview, onFileSelect }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="relative group w-full aspect-[21/9] bg-white rounded-[2.5rem] overflow-hidden border-2 border-red-50 shadow-sm">
      {preview ? (
        <>
          <img
            src={preview}
            className="w-full h-full object-cover"
            alt="Cover"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="absolute top-6 right-6 w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-600 shadow-xl"
          >
            <ImagePlus size={18} />
          </button>
        </>
      ) : (
        <div
          className="w-full h-full flex flex-col items-center justify-center bg-gray-50 gap-4 cursor-pointer"
          onClick={() => fileInputRef.current.click()}
        >
          <ImageIcon size={32} className="text-red-300" />
          <span className="text-xs font-bold text-red-600 underline uppercase">
            Tải ảnh bìa
          </span>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default CoverImage;
