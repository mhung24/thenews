import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import ModSidebar from "../components/ModSidebar";

const ModLayout = () => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="flex min-h-screen bg-[#FFF9F9]">
      <ModSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ModLayout;
