import React from "react";
import useGetCData from "@/hooks/useGetCData";
import NotFoundPage from "@/components/common/NotFoundPage";

const Main = ({ children }) => {
  const { path, accessList, role } = useGetCData();
  const isAdminRole =
    typeof role === "string" && role.toLowerCase().includes("admin");

  // Allow admin-like roles (contains 'admin') to access all pages, otherwise check accessList
  if (!isAdminRole && !accessList?.includes(path)) {
    return <NotFoundPage />;
  }
  return (
    <main className="h-full overflow-y-auto bg-slate-50 dark:bg-slate-900">
      <div className="sm:container grid lg:px-6 sm:px-4 px-2 mx-auto">
        {children}
      </div>
    </main>
  );
};

export default Main;
