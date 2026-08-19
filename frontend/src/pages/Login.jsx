import React, { useState } from "react";
import { EyeOff, Eye, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import API from "../axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.post(`/api/v1/user/login`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.data.success) {
        navigate("/");
        dispatch(setUser(res.data.user));
        localStorage.setItem("accessToken", res.data.accessToken);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-hidden bg-cover bg-[center_10%] bg-no-repeat px-4"
      style={{
        backgroundImage: "url('/ecommerce-login-bg.png')",
      }}
    >
      {/* Dark Overlay - No Blur */}
      <div className="absolute inset-0 bg-black/45"></div>

      {/* Login Card */}
      <div
        className="
        relative z-10 w-full max-w-sm mt-13
        rounded
        border border-gray-700/80
        bg-black/20
        p-4
        shadow-2xl
        backdrop-blur-md

        sm:p-8
        lg:p-10
      "
      >
        <form onSubmit={submitHandler}>
          <div>
            {/* Header */}
            <h2 className="text-lg font-bold text-white sm:text-xl">
              Login to your account
            </h2>

            <p className="mt-1 text-xs leading-5 text-gray-400 sm:text-sm">
              Enter your email below to login to your account
            </p>

            {/* Email */}
            <div className="mt-5 sm:mt-6">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-200"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                value={formData.email}
                type="email"
                placeholder="m@example.com"
                required
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-gray-700 bg-gray-800/90 px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 transition focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
              />
            </div>

            {/* Password Header */}
            <div className="mt-5 flex items-center justify-between gap-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-200"
              >
                Password
              </label>

              <Link
                to="/forgot-password"
                className="whitespace-nowrap text-[11px] text-gray-400 hover:text-white hover:underline sm:text-xs"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Password */}
            <div className="relative mt-2">
              <input
                id="password"
                name="password"
                value={formData.password}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-700 bg-gray-800/90 px-3 py-2.5 pr-10 text-sm text-white outline-none placeholder:text-gray-500 transition focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>

            {/* Login */}
            <button
              type="submit"
              disabled={loading}
              className="mt-5 flex w-full cursor-pointer items-center justify-center rounded-xl bg-white py-2.5 text-sm font-bold text-black shadow-sm transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-70 sm:mt-6"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                "Login"
              )}
            </button>

            {/* Signup */}
            <p className="mt-4 text-center text-xs text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-white hover:underline"
              >
                Signup
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
