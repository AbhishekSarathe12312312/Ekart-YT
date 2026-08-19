import {
  LayoutDashboard,
  PackagePlus,
  PackageSearch,
  User,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { to: "/dashboard/sales", label: "Dashboard", icon: LayoutDashboard },
    { to: "/dashboard/add-product", label: "Add Product", icon: PackagePlus },
    { to: "/dashboard/products", label: "Products", icon: PackageSearch },
    { to: "/dashboard/users", label: "Users", icon: User },
    { to: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
  ];

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900 p-4 text-white md:hidden">
        <span className="font-bold">Dashboard</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay/Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col gap-2 border-r border-gray-800 bg-gray-900 p-4 text-white shadow-lg transition-transform duration-300 ease-in-out md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-4 hidden text-xl font-bold border-b border-gray-800 pb-2 md:block">
          Admin Panel
        </div>

        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition ${
                  isActive
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </aside>

      {/* Backdrop for Mobile Menu */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;
