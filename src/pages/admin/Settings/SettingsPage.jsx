import React, { useState } from "react";

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
  ];

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <>
      <p>Đang phát triển</p>
    </>
  );
};

export default SettingsPage;
