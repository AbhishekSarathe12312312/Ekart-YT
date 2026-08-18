import {
  LayoutDashboard,
  PackagePlus,
  PackageSearch,
  User,
  FaceAngryIcon,
} from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sticky top-0 flex h-screen w-64 flex-col gap-2 border-r border-gray-800 bg-gray-900 p-4 text-white shadow-lg">
      <NavLink
        to="/dashboard/sales"
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition ${
            isActive
              ? "bg-white text-black shadow-sm"
              : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }`
        }
      >
        <LayoutDashboard size={20} />
        <span>Dashboard</span>
      </NavLink>

      <NavLink
        to="/dashboard/add-product"
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition ${
            isActive
              ? "bg-white text-black shadow-sm"
              : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }`
        }
      >
        <PackagePlus size={20} />
        <span>Add Product</span>
      </NavLink>

      <NavLink
        to="/dashboard/products"
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition ${
            isActive
              ? "bg-white text-black shadow-sm"
              : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }`
        }
      >
        <PackageSearch size={20} />
        <span>Products</span>
      </NavLink>

      <NavLink
        to="/dashboard/users"
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition ${
            isActive
              ? "bg-white text-black shadow-sm"
              : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }`
        }
      >
        <User size={20} />
        <span>Users</span>
      </NavLink>

      <NavLink
        to="/dashboard/orders"
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition ${
            isActive
              ? "bg-white text-black shadow-sm"
              : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }`
        }
      >
        <FaceAngryIcon size={20} />
        <span>Orders</span>
      </NavLink>
    </div>
  );
};

export default Sidebar;
