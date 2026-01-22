import React, { useState } from "react";
import {
  Settings,
  Mail,
  Zap,
  Activity,
  Save,
  Loader2,
  Code,
  Database,
  Server,
} from "lucide-react";
import TabMaintenance from "./TabMaintenance";
import TabApi from "./TabApi";
import TabEmail from "./TabEmail";
import TabGeneral from "./TabGeneral";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);

  const tabs = [
    {
      id: "general",
      label: "Chung",
      icon: <Settings size={18} />,
      color: "text-blue-500",
      component: <TabGeneral />,
    },
    {
      id: "email",
      label: "Email",
      icon: <Mail size={18} />,
      color: "text-rose-500",
      component: <TabEmail />,
    },
    {
      id: "api",
      label: "Kết nối",
      icon: <Zap size={18} />,
      color: "text-amber-500",
      component: <TabApi />,
    },
    {
      id: "maintenance",
      label: "Hệ thống",
      icon: <Activity size={18} />,
      color: "text-emerald-500",
      component: <TabMaintenance />,
    },
  ];

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
            Settings
          </h1>
          <div className="h-1.5 w-20 bg-blue-600 mt-2 rounded-full"></div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="group flex items-center gap-4 px-12 py-5 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.25em] rounded-[1.5rem] hover:bg-blue-600 transition-all shadow-2xl disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Save
              size={18}
              className="group-hover:scale-125 transition-transform"
            />
          )}
          Save Configuration
        </button>
      </div>

      <div className="flex p-2 bg-slate-100/50 rounded-[2.5rem] border border-slate-100 gap-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-10 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id
                ? "bg-white text-slate-900 shadow-xl scale-105"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <span
              className={activeTab === tab.id ? tab.color : "text-slate-300"}
            >
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-1 bg-white rounded-[4rem] shadow-sm border border-slate-100 min-h-[500px]">
        <div className="p-16">
          {tabs.find((t) => t.id === activeTab)?.component}
        </div>
      </div>

      <div className="flex justify-between items-center px-10 opacity-30 italic">
        <span className="text-[9px] font-black uppercase tracking-[0.4em]">
          System Admin v4.0.2
        </span>
        <div className="flex gap-6 text-slate-900">
          <Code size={14} /> <Database size={14} /> <Server size={14} />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
