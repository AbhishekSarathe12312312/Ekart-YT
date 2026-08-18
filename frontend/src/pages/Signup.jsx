import React, { useState } from "react";
import { EyeOff, Eye, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import API from "../axios";
import { toast } from "react-toastify";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

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
      const res = await API.post(
        `/api/v1/user/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (res.data.success) {
        navigate("/verify");
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
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-cover bg-[center_top_20%] bg-no-repeat px-4"
      style={{
        backgroundImage: "url('/ecommerce-login-bg.png')",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 backdrop:blur-2xl bg-black/45"></div>

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-sm rounded-[24px] border border-gray-700/80 bg-transparent p-10 shadow-2xl backdrop-blur-md">
        <form onSubmit={submitHandler}>
          <div>
            {/* Header */}
            <h2 className="text-xl font-bold text-white">
              Create your account
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Enter given details below to create your account
            </p>

            {/* First Name & Last Name */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-semibold text-gray-200"
                >
                  First Name
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  type="text"
                  placeholder="John"
                  required
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-gray-700 bg-gray-800/90 px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 transition focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
                />
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-semibold text-gray-200"
                >
                  Last Name
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  type="text"
                  placeholder="Doe"
                  required
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-gray-700 bg-gray-800/90 px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 transition focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
                />
              </div>
            </div>

            {/* Email */}
            <div className="mt-5">
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

            {/* Password */}
            <div className="mt-5">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-200"
              >
                Password
              </label>

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
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-white py-2.5 text-sm font-bold text-black shadow-sm transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                "Signup"
              )}
            </button>

            {/* Login Link */}
            <p className="mt-4 text-center text-xs text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-white hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
