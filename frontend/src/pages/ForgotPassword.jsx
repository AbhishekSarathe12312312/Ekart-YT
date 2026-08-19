import React, { useState } from "react";
import API from "../axios";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  // ================= SEND OTP =================

  const handleSendOTP = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/api/v1/user/forgot-password", {
        email,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setStep(2);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ================= VERIFY OTP =================

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post(
        `/api/v1/user/verify-otp/${encodeURIComponent(email)}`,
        {
          otp,
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setStep(3);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ================= CHANGE PASSWORD =================

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post(
        `/api/v1/user/change-password/${encodeURIComponent(email)}`,
        {
          newPassword,
          confirmPassword,
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      }
    } catch (error) {
      console.log("CHANGE PASSWORD ERROR:", error.response?.data);

      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ================= BACK =================

  const handleBack = () => {
    setStep(1);
    setOtp("");
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-hidden bg-cover bg-[center_40%] bg-no-repeat px-3 sm:px-4"
      style={{
        backgroundImage: "url('/password-recovery-bg.png')",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/45"></div>

      {/* Main Content */}
      <div className="relative  z-10 w-full max-w-[340px] sm:max-w-sm mt-7">
        {/* ================= STEPS ================= */}
        <div className="rounded p-2 mb-3 flex items-center justify-center">
          {/* STEP 1 */}
          <div className="flex items-center">
            <div
              className={`flex h-8 w-8  items-center justify-center rounded-full border transition-all ${
                step >= 1
                  ? "border-purple-400 bg-purple-500/20 text-purple-300"
                  : "border-gray-700 bg-gray-900/70 text-gray-600"
              }`}
            >
              <Mail size={15} />
            </div>

            <div className="ml-1.5 hidden sm:block">
              <p className="text-[8px] uppercase tracking-wider text-gray-300">
                Step 01
              </p>
              <p
                className={`text-[10px] font-semibold ${
                  step >= 1 ? "text-white" : "text-gray-600"
                }`}
              >
                Email
              </p>
            </div>
          </div>

          {/* LINE */}
          <div
            className={`mx-2 h-[2px] w-8 transition-all ${
              step >= 2
                ? "bg-gradient-to-r from-purple-500 to-blue-500"
                : "bg-gray-700"
            }`}
          />

          {/* STEP 2 */}
          <div className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
                step >= 2
                  ? "border-blue-400 bg-blue-500/20 text-blue-300"
                  : "border-gray-700 bg-gray-900/70 text-gray-600"
              }`}
            >
              <ShieldCheck size={15} />
            </div>

            <div className="ml-1.5 hidden sm:block">
              <p className="text-[8px] uppercase tracking-wider text-gray-300">
                Step 02
              </p>
              <p
                className={`text-[10px] font-semibold ${
                  step >= 2 ? "text-white" : "text-gray-600"
                }`}
              >
                Verify
              </p>
            </div>
          </div>

          {/* LINE */}
          <div
            className={`mx-2 h-[2px] w-8 transition-all ${
              step >= 3
                ? "bg-gradient-to-r from-blue-500 to-purple-500"
                : "bg-gray-700"
            }`}
          />

          {/* STEP 3 */}
          <div className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
                step >= 3
                  ? "border-purple-400 bg-purple-500/20 text-purple-300"
                  : "border-gray-700 bg-gray-900/70 text-gray-600"
              }`}
            >
              <Lock size={15} />
            </div>

            <div className="ml-1.5 hidden sm:block">
              <p className="text-[8px] uppercase tracking-wider text-gray-300">
                Step 03
              </p>
              <p
                className={`text-[10px] font-semibold ${
                  step >= 3 ? "text-white" : "text-gray-600"
                }`}
              >
                Password
              </p>
            </div>
          </div>
        </div>

        {/* ================= MAIN CARD ================= */}
        <div
          className="
          w-full
          rounded
          border border-gray-700/80
          bg-black/30
          p-4
          shadow-2xl
          backdrop-blur-md
          sm:p-6
        "
        >
          {/* TOP ICON */}
          <div className="mb-3 flex justify-center">
            <div
              className="
              flex h-11 w-11
              items-center justify-center
              rounded-xl
              border border-purple-400/20
              bg-purple-500/10
              text-purple-300
            "
            >
              {step === 1 && <Mail size={21} />}
              {step === 2 && <ShieldCheck size={21} />}
              {step === 3 && <Lock size={21} />}
            </div>
          </div>

          {/* HEADING */}
          <div className="mb-4 text-center">
            <p className="mb-1 text-[8px] font-semibold uppercase tracking-[0.25em] text-purple-400">
              Account Recovery
            </p>

            <h1 className="text-lg font-bold text-white sm:text-xl">
              {step === 1 && "Forgot Password?"}
              {step === 2 && "Verify OTP"}
              {step === 3 && "Create New Password"}
            </h1>

            <p className="mx-auto mt-1 text-[11px] leading-4 text-gray-400 sm:text-xs">
              {step === 1 &&
                "Enter your email and we'll send you a secure OTP."}

              {step === 2 && `Enter the 6-digit OTP sent to ${email}`}

              {step === 3 && "Create a new password to secure your account."}
            </p>
          </div>

          {/* ================= STEP 1 ================= */}
          {step === 1 && (
            <form onSubmit={handleSendOTP}>
              <label className="block text-xs font-semibold text-gray-200">
                Email Address
              </label>

              <div className="relative mt-1.5">
                <Mail
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                  className="
                  h-10 w-full rounded-xl
                  border border-gray-700
                  bg-gray-800/90
                  pl-9 pr-3
                  text-xs text-white
                  outline-none
                  placeholder:text-gray-600
                  transition
                  focus:border-purple-500
                  focus:ring-1
                  focus:ring-purple-500/30
                "
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="
                mt-3 flex h-10 w-full
                cursor-pointer
                items-center justify-center gap-2
                rounded-xl
                bg-white
                text-xs font-bold text-black
                transition
                hover:bg-gray-200
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Mail size={15} />
                    Send OTP
                  </>
                )}
              </button>
            </form>
          )}

          {/* ================= STEP 2 ================= */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP}>
              <label className="block text-xs font-semibold text-gray-200">
                Verification Code
              </label>

              <div className="relative mt-1.5">
                <ShieldCheck
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  required
                  className="
                  h-11 w-full rounded-xl
                  border border-gray-700
                  bg-gray-800/90
                  pl-9 pr-3
                  text-center
                  text-base font-bold
                  tracking-[7px]
                  text-white
                  outline-none
                  placeholder:text-gray-700
                  focus:border-blue-500
                  focus:ring-1
                  focus:ring-blue-500/30
                "
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="
                mt-3 flex h-10 w-full
                cursor-pointer
                items-center justify-center gap-2
                rounded-xl
                bg-white
                text-xs font-bold text-black
                transition
                hover:bg-gray-200
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={15} />
                    Verify OTP
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBack}
                className="
                mt-2 w-full
                cursor-pointer
                text-[11px]
                font-semibold
                text-gray-500
                hover:text-white
              "
              >
                ← Change Email
              </button>
            </form>
          )}

          {/* ================= STEP 3 ================= */}
          {step === 3 && (
            <form onSubmit={handleChangePassword}>
              {/* New Password */}
              <label className="block text-xs font-semibold text-gray-200">
                New Password
              </label>

              <div className="relative mt-1.5">
                <Lock
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className="
                  h-10 w-full rounded-xl
                  border border-gray-700
                  bg-gray-800/90
                  pl-9 pr-10
                  text-xs text-white
                  outline-none
                  placeholder:text-gray-600
                  focus:border-purple-500
                  focus:ring-1
                  focus:ring-purple-500/30
                "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
                  absolute right-3 top-1/2
                  -translate-y-1/2
                  text-gray-500
                  hover:text-white
                "
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              {/* Confirm Password */}
              <label className="mt-3 block text-xs font-semibold text-gray-200">
                Confirm Password
              </label>

              <div className="relative mt-1.5">
                <Lock
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  className="
                  h-10 w-full rounded-xl
                  border border-gray-700
                  bg-gray-800/90
                  pl-9 pr-10
                  text-xs text-white
                  outline-none
                  placeholder:text-gray-600
                  focus:border-purple-500
                  focus:ring-1
                  focus:ring-purple-500/30
                "
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="
                  absolute right-3 top-1/2
                  -translate-y-1/2
                  text-gray-500
                  hover:text-white
                "
                >
                  {showConfirmPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="
                mt-3 flex h-10 w-full
                cursor-pointer
                items-center justify-center gap-2
                rounded-xl
                bg-white
                text-xs font-bold text-black
                transition
                hover:bg-gray-200
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    Change Password
                  </>
                )}
              </button>
            </form>
          )}

          {/* Back To Login */}
          <div className="mt-4 border-t border-gray-800 pt-3 text-center">
            <Link
              to="/login"
              className="
              inline-flex items-center gap-1.5
              text-[11px] font-semibold
              text-gray-500
              transition
              hover:text-white
            "
            >
              <ArrowLeft size={13} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
