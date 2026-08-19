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
      {/* ================= MOBILE VIEW (Horizontal Scroll Tabs) ================= */}
      <div className="sticky top-0 z-40 border-b border-gray-800 bg-gray-900 text-white md:hidden">
        {/* Mobile Top Title */}
        <div className="px-4 pt-3 pb-2">
          <span className="text-base font-bold tracking-wide">Admin Panel</span>
        </div>

        {/* Horizontal Scrollable Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-white text-black shadow-md"
                      : "border border-gray-800 bg-gray-950/60 text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
                <Icon size={16} />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* ================= LAPTOP / DESKTOP VIEW (Full Sidebar) ================= */}
      <aside className="hidden md:sticky md:top-0 md:flex md:h-screen md:w-64 md:shrink-0 md:flex-col md:gap-2 md:border-r md:border-gray-800 md:bg-gray-900 md:p-4 md:text-white">
        <div className="mb-4 border-b border-gray-800 pb-3 text-xl font-bold">
          Admin Panel
        </div>

        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
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
    </>
  );
};

export default Sidebar;
