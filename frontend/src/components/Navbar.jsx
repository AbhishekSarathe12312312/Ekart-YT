import API from "../axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setUser } from "../redux/userSlice";

const Navbar = () => {
  // Mobile sidebar open/close state
  const [isOpen, setIsOpen] = useState(false);

  // Accessing state using standard useSelector
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((store) => store.product);
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const admin = user?.role === "admin" ? true : false;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const logoutHandler = async () => {
    try {
      const res = await API.post(
        `/api/v1/user/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        // Clear Redux state
        dispatch(setUser(null));

        // Clean up token storage
        localStorage.removeItem("accessToken");

        toast.success(res.data.message);
        setIsOpen(false);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-gray-800/80 bg-gray-950/95 px-3 py-2.5 shadow-xl backdrop-blur-3xl sm:px-4 md:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-4">
          {/* Mobile Hamburger + Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Hamburger Icon */}
            <button
              onClick={toggleSidebar}
              aria-label="Toggle Menu"
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white md:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>

            {/* Logo (Sized dynamically for mobile & desktop) */}
            <Link
              to="/"
              className="group flex shrink-0 items-center transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              <img
                src="/Ekart.png"
                alt="Ekart Logo"
                className="h-10 pt-2 w-auto object-contain drop-shadow-md transition duration-300  group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            <Link
              to="/"
              className="group relative rounded-xl px-4 py-2 text-sm font-semibold text-gray-400 transition-all duration-300 hover:bg-gray-800/80 hover:text-white"
            >
              <span className="relative z-10">Home</span>
              <span className="absolute bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-white transition-all duration-300 group-hover:w-5" />
            </Link>

            <Link
              to="/products"
              className="group relative rounded-xl px-4 py-2 text-sm font-semibold text-gray-400 transition-all duration-300 hover:bg-gray-800/80 hover:text-white"
            >
              <span className="relative z-10">Products</span>
              <span className="absolute bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-white transition-all duration-300 group-hover:w-5" />
            </Link>

            <Link
              to="/myorder"
              className="group relative rounded-xl px-4 py-2 text-sm font-semibold text-gray-400 transition-all duration-300 hover:bg-gray-800/80 hover:text-white"
            >
              <span className="relative z-10">My Orders</span>
              <span className="absolute bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-white transition-all duration-300 group-hover:w-5" />
            </Link>

            {/* Profile */}
            {user && (
              <Link
                to={`/profile/${user._id}`}
                className="group ml-3 flex items-center gap-2 rounded-2xl border border-gray-800 bg-gray-900/80 px-3 py-1.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-600 hover:bg-gray-800 hover:shadow-lg"
              >
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-gray-700 bg-gray-700 text-xs font-bold text-white transition-transform duration-300 group-hover:scale-110">
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    user.firstName?.charAt(0).toUpperCase()
                  )}
                </div>

                <span className="hidden text-sm font-medium text-gray-400 lg:block">
                  Hello,{" "}
                  <span className="font-semibold text-white transition-colors group-hover:text-gray-200">
                    {user.firstName}
                  </span>
                </span>
              </Link>
            )}

            {/* Dashboard */}
            {admin && (
              <Link
                to="/dashboard/sales"
                className="ml-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-black shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-200 hover:shadow-xl active:scale-95"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Top Right Controls (Desktop & Mobile header) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart */}
            <Link
              to="/cart"
              className="group relative flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-3 py-2 text-sm font-semibold text-gray-400 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-600 hover:bg-gray-800 hover:text-white hover:shadow-lg sm:px-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835L5.7 6.75m0 0h14.55l-1.35 6.75H7.05L5.7 6.75Zm1.35 6.75-1.2 2.4a1.125 1.125 0 0 0 1.006 1.63h11.544M8.25 20.25h.008v.008H8.25v-.008Zm9 0h.008v.008h-.008v-.008Z"
                />
              </svg>

              <span className="hidden sm:block">Cart</span>

              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-[10px] font-bold text-black transition-transform duration-300 group-hover:scale-110">
                {cart?.items?.length || 0}
              </span>
            </Link>

            {/* Login / Logout (Desktop) */}
            <div className="hidden md:block">
              {user ? (
                <button
                  onClick={logoutHandler}
                  className="cursor-pointer rounded-xl border border-red-900/70 bg-red-950/70 px-4 py-2 text-sm font-semibold text-red-400 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-red-700 hover:bg-red-900 hover:text-red-200 hover:shadow-lg active:scale-95"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="cursor-pointer rounded-xl bg-white px-5 py-2 text-sm font-bold text-black shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-200 hover:shadow-xl active:scale-95"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 flex h-full w-72 flex-col justify-between border-r border-gray-800 bg-gray-850 p-5 shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Top Bar inside Sidebar */}
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <img
              src="/Ekart.png"
              alt="Ekart Logo"
              className="h-9 mt-1 pt-2 w-auto object-contain"
            />
            <button
              onClick={toggleSidebar}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* User Profile Info */}
          {user && (
            <Link
              to={`/profile/${user._id}`}
              onClick={toggleSidebar}
              className="my-4 flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/80 p-3 transition-colors hover:bg-gray-800"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-700 bg-gray-800 text-xs font-bold text-white">
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  user.firstName?.charAt(0).toUpperCase()
                )}
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] text-gray-400">Hello,</p>
                <p className="truncate text-sm font-semibold text-white">
                  {user.firstName}
                </p>
              </div>
            </Link>
          )}

          {/* Mobile Navigation Links */}
          <div className="mt-4 flex flex-col gap-2">
            <Link
              to="/"
              onClick={toggleSidebar}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              Home
            </Link>

            <Link
              to="/products"
              onClick={toggleSidebar}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              Products
            </Link>

            <Link
              to="/myorder"
              onClick={toggleSidebar}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              My Orders
            </Link>

            {admin && (
              <Link
                to="/dashboard/sales"
                onClick={toggleSidebar}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>

        {/* Bottom Actions inside Sidebar (Logout / Login) */}
        <div className="border-t border-gray-800 pt-4">
          {user ? (
            <button
              onClick={logoutHandler}
              className="w-full rounded-xl border border-red-900/70 bg-red-950/70 py-2.5 text-center text-sm font-semibold text-red-400 transition-colors hover:bg-red-900 hover:text-red-200"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/login");
              }}
              className="w-full rounded-xl bg-white py-2.5 text-center text-sm font-bold text-black hover:bg-gray-200"
            >
              Login
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Navbar;
