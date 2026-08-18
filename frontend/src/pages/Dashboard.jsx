import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-red-800">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="min-h-screen flex-1 bg-gray-950 p-6 text-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
