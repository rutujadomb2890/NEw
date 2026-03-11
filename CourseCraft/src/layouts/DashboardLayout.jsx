import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import React from "react";

const DashboardLayout = ({ children, role }) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-200 via-blue-100 to-purple-200">

        <Sidebar role={role} />
        <div className="flex-1 flex flex-col">
        <Topbar role={role} />
        <div className="p-6">
          {children}
        </div>
      </div>

    </div>
  );
};

export default DashboardLayout;
