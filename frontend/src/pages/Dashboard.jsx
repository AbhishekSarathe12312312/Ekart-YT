import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    /* min-h-screen me overflow-x-hidden add karein taaki screen right side me Na bhage */
    <div className="min-h-screen w-full bg-gray-950 md:flex">
      {/* Sidebar Mobile Top Bar + Overlay Slider */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="min-h-screen flex-1 p-3 sm:p-6 text-gray-100 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
