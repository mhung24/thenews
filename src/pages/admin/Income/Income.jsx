import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Download,
  Clock,
  CheckCircle2,
  Wallet,
  Loader2,
  Award,
  Zap,
  ChevronRight,
  BarChart3,
  CreditCard,
  X,
  Plus,
  Target,
} from "lucide-react";
import { notification } from "../../../utils/swal";
import { userService } from "../../../services/userService";
import { articleService } from "../../../services/articleService";

const Income = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [experience, setExperience] = useState(0);
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankInfo, setBankInfo] = useState({
    bankName: "Vietcombank",
    accountNumber: "**** **** **** 1234",
    accountName: "NGUYEN VAN A",
  });

  const [stats, setStats] = useState({
    totalEarnings: 0,
    withdrawn: 22450000,
    publishedCount: 0,
  });

  const calculateIncomeByExperience = (exp, views = 0) => {
    const viewFactor = Math.floor(views / 1000);
    let basePay = 0;
    let bonusPer1k = 0;

    if (exp < 1) {
      basePay = 600000;
      bonusPer1k = 25000;
    } else if (exp >= 1 && exp < 3) {
      basePay = 700000;
      bonusPer1k = 30000;
    } else if (exp >= 3 && exp < 6) {
      basePay = 800000;
      bonusPer1k = 35000;
    } else {
      basePay = 950000;
      bonusPer1k = 50000;
    }

    return {
      total: basePay + viewFactor * bonusPer1k,
      basePay,
      viewBonus: viewFactor * bonusPer1k,
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await userService.getProfile();
        const yearsExp = profileRes.data.years_of_experience || 0;
        setExperience(yearsExp);

        const articlesRes = await articleService.getMyArticles();
        if (articlesRes.data) {
          const allData = articlesRes.data.data.data || [];

          // CHỈ TÍNH TIỀN CHO BÀI ĐÃ DUYỆT (PUBLISHED)
          const publishedArticles = allData.filter(
            (art) => art.status === "published"
          );
          setArticles(publishedArticles);

          const total = publishedArticles.reduce(
            (acc, art) =>
              acc + calculateIncomeByExperience(yearsExp, art.views || 0).total,
            0
          );

          setStats((prev) => ({
            ...prev,
            totalEarnings: total,
            publishedCount: publishedArticles.length,
          }));
        }
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateBank = (e) => {
    e.preventDefault();
    notification.success("Đã cập nhật thông tin ngân hàng thành công!");
    setShowBankModal(false);
  };

  const formatMoney = (amount) => new Intl.NumberFormat("vi-VN").format(amount);

  // Tính % KPI (Mục tiêu tối thiểu 15 bài)
  const kpiPercentage = Math.min(
    Math.round((stats.publishedCount / 15) * 100),
    100
  );

  return (
    <div className="animate-in fade-in duration-1000 max-w-[1400px] mx-auto pb-20 px-4">
      {/* Banner & Balance */}
      <div className="relative overflow-hidden rounded-[3.5rem] bg-slate-900 p-10 md:p-16 mb-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-red-600/10 to-transparent"></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter italic">
              Income <span className="text-red-600">Analytics.</span>
            </h1>
            <div className="flex items-center justify-center lg:justify-start gap-8">
              <div className="flex flex-col">
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  Kinh nghiệm
                </span>
                <span className="text-white text-2xl font-black italic">
                  {experience} Năm
                </span>
              </div>
              <div className="w-[1px] h-10 bg-white/10"></div>
              <div className="flex flex-col">
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  Cấp bậc
                </span>
                <span className="text-red-500 text-2xl font-black italic uppercase">
                  Bậc{" "}
                  {experience < 1
                    ? "1"
                    : experience < 3
                    ? "2"
                    : experience < 6
                    ? "3"
                    : "4"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[3rem] w-full lg:w-auto min-w-[380px]">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">
              Balance Available (Verified Only)
            </p>
            <div className="flex items-baseline justify-center lg:justify-start gap-2 mb-8">
              <span className="text-6xl font-black text-white tracking-tighter">
                {loading ? "---" : formatMoney(stats.totalEarnings)}
              </span>
              <span className="text-red-600 font-black italic text-xl">
                VND
              </span>
            </div>
            <button className="w-full py-5 bg-white text-slate-900 hover:bg-red-600 hover:text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 shadow-xl shadow-white/5">
              Rút tiền ngay
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1 space-y-8">
          {/* KPI Card */}
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                KPI Tháng này
              </h3>
              <Target size={18} className="text-red-600" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-3xl font-black text-slate-900 tracking-tighter">
                  {stats.publishedCount}
                  <span className="text-sm text-slate-300 ml-1">/ 20</span>
                </span>
                <span className="text-xs font-black text-red-600 uppercase">
                  {kpiPercentage}%
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-600 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                  style={{ width: `${kpiPercentage}%` }}
                ></div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 italic">
                Mục tiêu tối thiểu: 15 bài
              </p>
            </div>
          </div>

          {/* Credit Card View */}
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative group overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Thanh toán
              </h3>
              <button
                onClick={() => setShowBankModal(true)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-red-600"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-[2rem] text-white shadow-xl relative overflow-hidden h-44 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <CreditCard size={28} className="opacity-80" />
                <span className="text-[10px] font-black italic opacity-50 uppercase tracking-widest">
                  {bankInfo.bankName}
                </span>
              </div>
              <div>
                <p className="text-lg font-mono tracking-[0.2em] mb-2">
                  {bankInfo.accountNumber}
                </p>
                <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">
                  {bankInfo.accountName}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed List */}
        <div className="lg:col-span-3 bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">
              Bảng kê thu nhập (Đã duyệt)
            </h3>
            <BarChart3 className="text-slate-300" />
          </div>
          <div className="divide-y divide-slate-50">
            {!loading && articles.length > 0
              ? articles.map((art, idx) => {
                  const result = calculateIncomeByExperience(
                    experience,
                    art.views || 0
                  );
                  return (
                    <div
                      key={idx}
                      className="group flex flex-col md:flex-row md:items-center justify-between p-10 hover:bg-slate-50/80 transition-all"
                    >
                      <div className="flex items-center gap-8">
                        <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black italic text-lg shadow-lg">
                          {String(idx + 1).padStart(2, "0")}
                        </div>
                        <div>
                          <h4 className="font-black text-slate-800 text-lg group-hover:text-red-600 transition-colors line-clamp-1">
                            {art.title}
                          </h4>
                          <div className="flex items-center gap-4 mt-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              {art.views || 0} Views
                            </p>
                            <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                              +{formatMoney(result.viewBonus)}đ Bonus
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right mt-4 md:mt-0">
                        <p className="text-3xl font-black text-slate-900 tracking-tighter">
                          +{formatMoney(result.total)}đ
                        </p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          Cứng: {formatMoney(result.basePay)}đ
                        </p>
                      </div>
                    </div>
                  );
                })
              : !loading && (
                  <div className="py-20 text-center text-slate-300 font-black uppercase tracking-widest">
                    Chưa có bài viết nào được duyệt tính tiền
                  </div>
                )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showBankModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowBankModal(false)}
          ></div>
          <div className="relative bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in duration-300">
            <button
              onClick={() => setShowBankModal(false)}
              className="absolute right-8 top-8 text-slate-400 hover:text-slate-900"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-8 italic">
              Update Card
            </h3>
            <form onSubmit={handleUpdateBank} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  Tên ngân hàng
                </label>
                <input
                  required
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-red-100 transition-all"
                  value={bankInfo.bankName}
                  onChange={(e) =>
                    setBankInfo({ ...bankInfo, bankName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  Số tài khoản
                </label>
                <input
                  required
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-red-100 transition-all"
                  value={bankInfo.accountNumber}
                  onChange={(e) =>
                    setBankInfo({ ...bankInfo, accountNumber: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  Chủ tài khoản
                </label>
                <input
                  required
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-red-100 transition-all"
                  value={bankInfo.accountName}
                  onChange={(e) =>
                    setBankInfo({
                      ...bankInfo,
                      accountName: e.target.value.toUpperCase(),
                    })
                  }
                />
              </div>
              <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all">
                Cập nhật thông tin thẻ
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Income;
