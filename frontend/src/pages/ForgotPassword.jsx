import React, { useState } from "react";
import axios from "axios";
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

      const res = await axios.post(
        "http://localhost:8000/api/v1/user/forgot-password",
        {
          email,
        },
      );

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

      const res = await axios.post(
        `http://localhost:8000/api/v1/user/verify-otp/${encodeURIComponent(
          email,
        )}`,
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

      const res = await axios.post(
        `http://localhost:8000/api/v1/user/change-password/${encodeURIComponent(
          email,
        )}`,
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
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat px-4 py-10"
      style={{
        backgroundImage: "url('/password-recovery-bg.png')",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px]" />

      {/* Background Glow */}
      <div className="absolute left-[8%] top-[15%] h-56 w-56 rounded-full bg-purple-600/20 blur-[110px]" />

      <div className="absolute bottom-[10%] right-[8%] h-64 w-64 rounded-full bg-blue-600/20 blur-[120px]" />

      {/* ================= FLOATING ICONS ================= */}

      {/* Left Top */}
      <div className="absolute left-[10%] top-[20%] hidden h-12 w-12 -rotate-12 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10 text-purple-300 backdrop-blur-md lg:flex">
        <Lock size={21} />
      </div>

      {/* Left Bottom */}
      <div className="absolute bottom-[20%] left-[14%] hidden h-11 w-11 rotate-6 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-300 backdrop-blur-md lg:flex">
        <ShieldCheck size={19} />
      </div>

      {/* Right Top */}
      <div className="absolute right-[11%] top-[21%] hidden h-12 w-12 rotate-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-300 backdrop-blur-md lg:flex">
        <Mail size={21} />
      </div>

      {/* Right Bottom */}
      <div className="absolute bottom-[18%] right-[15%] hidden h-11 w-11 -rotate-6 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10 text-purple-300 backdrop-blur-md lg:flex">
        <KeyRound size={19} />
      </div>

      {/* Small Dots */}
      <div className="absolute left-[25%] top-[18%] h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_12px_#a855f7]" />

      <div className="absolute right-[25%] top-[19%] h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_12px_#3b82f6]" />

      <div className="absolute bottom-[24%] left-[26%] h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_12px_#3b82f6]" />

      <div className="absolute bottom-[28%] right-[27%] h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_12px_#a855f7]" />

      {/* ================= MAIN CONTENT ================= */}

      <div className="relative z-10 w-full max-w-sm">
        {/* ================= 3 STEPS ================= */}

        <div className="relative z-20 mb-5 flex items-center justify-center">
          {/* STEP 1 */}

          <div className="flex items-center">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-500 ${
                step >= 1
                  ? "border-purple-400 bg-purple-500/20 text-purple-300 shadow-[0_0_18px_rgba(168,85,247,0.25)]"
                  : "border-gray-700 bg-gray-900/70 text-gray-600"
              }`}
            >
              <Mail size={16} />
            </div>

            <div className="ml-2 hidden sm:block">
              <p className="text-[8px] uppercase tracking-[0.2em] text-gray-500">
                Step 01
              </p>

              <p
                className={`text-[11px] font-semibold ${
                  step >= 1 ? "text-white" : "text-gray-600"
                }`}
              >
                Email
              </p>
            </div>
          </div>

          {/* LINE */}

          <div
            className={`mx-2 h-[2px] w-7 sm:w-10 transition-all duration-500 ${
              step >= 2
                ? "bg-gradient-to-r from-purple-500 to-blue-500"
                : "bg-gray-700"
            }`}
          />

          {/* STEP 2 */}

          <div className="flex items-center">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-500 ${
                step >= 2
                  ? "border-blue-400 bg-blue-500/20 text-blue-300 shadow-[0_0_18px_rgba(59,130,246,0.25)]"
                  : "border-gray-700 bg-gray-900/70 text-gray-600"
              }`}
            >
              <ShieldCheck size={16} />
            </div>

            <div className="ml-2 hidden sm:block">
              <p className="text-[8px] uppercase tracking-[0.2em] text-gray-500">
                Step 02
              </p>

              <p
                className={`text-[11px] font-semibold ${
                  step >= 2 ? "text-white" : "text-gray-600"
                }`}
              >
                Verify
              </p>
            </div>
          </div>

          {/* LINE */}

          <div
            className={`mx-2 h-[2px] w-7 sm:w-10 transition-all duration-500 ${
              step >= 3
                ? "bg-gradient-to-r from-blue-500 to-purple-500"
                : "bg-gray-700"
            }`}
          />

          {/* STEP 3 */}

          <div className="flex items-center">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-500 ${
                step >= 3
                  ? "border-purple-400 bg-purple-500/20 text-purple-300 shadow-[0_0_18px_rgba(168,85,247,0.25)]"
                  : "border-gray-700 bg-gray-900/70 text-gray-600"
              }`}
            >
              <Lock size={16} />
            </div>

            <div className="ml-2 hidden sm:block">
              <p className="text-[8px] uppercase tracking-[0.2em] text-gray-500">
                Step 03
              </p>

              <p
                className={`text-[11px] font-semibold ${
                  step >= 3 ? "text-white" : "text-gray-600"
                }`}
              >
                Password
              </p>
            </div>
          </div>
        </div>

        {/* ================= CARD GLOW ================= */}

        <div className="absolute -inset-1 rounded-[26px] bg-gradient-to-r from-purple-600/20 via-blue-600/10 to-purple-600/20 blur-xl" />

        {/* ================= MAIN CARD ================= */}

        <div className="relative rounded-[24px] border border-gray-700/80 bg-gray-950/80 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-7">
          {/* ================= TOP ICON ================= */}

          <div className="mb-5 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-purple-600/30 blur-xl" />

              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-400/20 bg-gradient-to-br from-purple-500/15 to-blue-500/10 text-purple-300">
                {step === 1 && <Mail size={26} />}

                {step === 2 && <ShieldCheck size={26} />}

                {step === 3 && <Lock size={26} />}
              </div>
            </div>
          </div>

          {/* ================= HEADING ================= */}

          <div className="mb-5 text-center">
            <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.3em] text-purple-400">
              Account Recovery
            </p>

            <h1 className="text-xl font-bold tracking-tight text-white">
              {step === 1 && "Forgot Password?"}

              {step === 2 && "Verify OTP"}

              {step === 3 && "Create New Password"}
            </h1>

            <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-gray-400">
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
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                  className="h-11 w-full rounded-xl border border-gray-700 bg-gray-800/80 pl-10 pr-3 text-xs text-white outline-none transition placeholder:text-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-xs font-bold text-white shadow-lg shadow-purple-900/20 transition hover:from-purple-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Mail size={16} />
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
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  required
                  className="h-12 w-full rounded-xl border border-gray-700 bg-gray-800/80 pl-10 pr-3 text-center text-lg font-bold tracking-[9px] text-white outline-none transition placeholder:text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-xs font-bold text-white shadow-lg shadow-blue-900/20 transition hover:from-blue-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    Verify OTP
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBack}
                className="mt-3 w-full cursor-pointer text-[11px] font-semibold text-gray-500 transition hover:text-white"
              >
                ← Change Email
              </button>
            </form>
          )}

          {/* ================= STEP 3 ================= */}

          {step === 3 && (
            <form onSubmit={handleChangePassword}>
              {/* NEW PASSWORD */}

              <label className="block text-xs font-semibold text-gray-200">
                New Password
              </label>

              <div className="relative mt-1.5">
                <Lock
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className="h-11 w-full rounded-xl border border-gray-700 bg-gray-800/80 pl-10 pr-11 text-xs text-white outline-none transition placeholder:text-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 transition hover:text-white"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              {/* CONFIRM PASSWORD */}

              <label className="mt-4 block text-xs font-semibold text-gray-200">
                Confirm Password
              </label>

              <div className="relative mt-1.5">
                <Lock
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  className="h-11 w-full rounded-xl border border-gray-700 bg-gray-800/80 pl-10 pr-11 text-xs text-white outline-none transition placeholder:text-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 transition hover:text-white"
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
                className="mt-4 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-xs font-bold text-white shadow-lg shadow-purple-900/20 transition hover:from-purple-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Change Password
                  </>
                )}
              </button>
            </form>
          )}

          {/* ================= BACK TO LOGIN ================= */}

          <div className="mt-5 border-t border-gray-800 pt-4 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 transition hover:text-white"
            >
              <ArrowLeft size={14} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
