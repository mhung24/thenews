import React, { useState } from "react";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  FileCode,
  Loader2,
  RefreshCw,
  Copy,
  Check,
  Lock,
  Shield,
  Download,
} from "lucide-react";
import Swal from "sweetalert2";

const SqlViewer = () => {
  const [sqlContent, setSqlContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchSql = async () => {
    const { value: password } = await Swal.fire({
      title: "Xác thực quyền Admin",
      input: "password",
      inputLabel: "Nhập mật khẩu hệ thống để xuất SQL",
      inputPlaceholder: "••••••••",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#2563eb",
      borderRadius: "1.5rem",
      inputAttributes: {
        autocapitalize: "off",
        autocorrect: "off",
      },
    });

    if (password) {
      setLoading(true);
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/moderator/system/export-sql`,
          {
            confirm_password: password,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (res.data.status === 200) {
          setSqlContent(res.data.sql_content);
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Dữ liệu SQL đã được trích xuất!",
            timer: 1500,
            showConfirmButton: false,
            borderRadius: "1.5rem",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Từ chối truy cập",
          text: error.response?.data?.message || "Mật khẩu không chính xác!",
          borderRadius: "1.5rem",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSqlFile = () => {
    if (!sqlContent) return;
    const element = document.createElement("a");
    const file = new Blob([sqlContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `VNDaily_Backup_${new Date().toISOString().slice(0, 10)}.sql`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="p-8 bg-[#0f172a] min-h-screen font-sans text-slate-300">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500/20 rounded-lg text-amber-500">
              <Lock size={24} />
            </div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">
              Secure SQL Viewer
            </h1>
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
            Khu vực hạn chế • Yêu cầu mật khẩu xác minh
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            disabled={!sqlContent}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 border border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all disabled:opacity-30"
          >
            {copied ? (
              <Check size={14} className="text-emerald-500" />
            ) : (
              <Copy size={14} />
            )}
            {copied ? "Đã sao chép" : "Copy SQL"}
          </button>

          <button
            onClick={downloadSqlFile}
            disabled={!sqlContent}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 border border-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all disabled:opacity-30"
          >
            <Download size={14} />
            Tải File
          </button>

          <button
            onClick={fetchSql}
            disabled={loading}
            className="flex items-center gap-3 px-8 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 shadow-xl shadow-blue-900/20 transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Shield size={16} />
            )}
            {loading ? "Đang xác thực..." : "Unlock SQL Data"}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="bg-[#1e293b] rounded-[2rem] border border-slate-800 shadow-2xl overflow-hidden relative">
          <div className="max-h-[70vh] overflow-y-auto no-scrollbar">
            <SyntaxHighlighter
              language="sql"
              style={atomDark}
              customStyle={{
                margin: 0,
                padding: "2.5rem",
                fontSize: "13px",
                lineHeight: "1.6",
                background: "transparent",
              }}
              showLineNumbers={true}
            >
              {sqlContent ||
                "-- Nhấn 'Unlock' và nhập mật khẩu để xem dữ liệu..."}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SqlViewer;
