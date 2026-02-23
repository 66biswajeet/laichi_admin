import React from "react";
import SidebarContent from "@/components/sidebar/SidebarContent";

const DesktopSidebar = () => {
  return (
    <aside className="z-30 flex-shrink-0 hidden shadow-sm w-64 overflow-y-auto bg-white dark:bg-slate-900 lg:block no-scrollbar">
      <SidebarContent />
    </aside>
  );
};

export default DesktopSidebar;
