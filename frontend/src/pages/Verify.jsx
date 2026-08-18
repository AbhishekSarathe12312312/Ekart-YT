import React from "react";

const Verify = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <div className="mb-5 text-5xl">📧</div>

        <h2 className="mb-3 text-2xl font-bold text-gray-800">
          Check your email
        </h2>

        <p className="text-sm leading-6 text-gray-600">
          We've sent you an email to verify your account. Please check your
          inbox and click the verification link.
        </p>
      </div>
    </div>
  );
};

export default Verify;
