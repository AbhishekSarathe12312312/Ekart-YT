import React, { useState } from "react";
import { EyeOff, Eye, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
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
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
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
      className="relative flex min-h-fit w-full items-center justify-center overflow-hidden bg-cover bg-[center_top_20%] bg-no-repeat px-4"
      style={{
        backgroundImage: "url('/ecommerce-login-bg.png')",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 backdrop:blur-2xl bg-black/45"></div>

      {/* Login Card */}
      <div className="relative mt-14 mb-14 z-10 w-full max-w-sm rounded-[24px] border border-gray-700/80 bg-transparent p-10 shadow-2xl backdrop-blur-md">
        <form onSubmit={submitHandler}>
          <div>
            {/* Header */}
            <h2 className="text-xl font-bold text-white">
              Login to your account
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Enter your email below to login to your account
            </p>

            {/* Email Field */}
            <div className="mt-6">
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
            <div className="mt-5 flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-200"
              >
                Password
              </label>

              <Link to='/forget-password' className="cursor-pointer text-xs text-gray-400 hover:text-white hover:underline">
                Forgot your password?
              </Link>
            </div>

            {/* Password Input */}
            <div className="relative mt-2">
              <input
                id="password"
                name="password"
                value={formData.password}
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                required
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-700 bg-gray-800/90 px-3 py-2.5 pr-10 text-sm text-white outline-none placeholder:text-gray-500 transition focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-white"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex cursor-pointer w-full items-center justify-center rounded-xl bg-white py-2.5 text-sm font-bold text-black shadow-sm transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                "Login"
              )}
            </button>

            {/* Signup Link */}
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
