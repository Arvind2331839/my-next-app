"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function FailurePageContent() {
  const params = useSearchParams();
  const reason = params.get("reason") || "unknown";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 opacity-20 blur-xl"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-red-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-800 mb-2">
            Verification Failed
          </h1>
          <p className="text-gray-700 mb-4">
            Reason: {reason.replaceAll("_", " ")}
          </p>
          <p className="text-gray-600 mb-6">
            Please request a new verification email or contact support.
          </p>
          <div className="flex gap-3 justify-center">
            <a
              href="/resend-verification"
              className="inline-block px-5 py-2 bg-red-600 text-white font-semibold rounded-full shadow hover:bg-red-700 transition"
            >
              Resend Email
            </a>
            <a
              href="/login"
              className="inline-block px-5 py-2 border border-red-600 text-red-600 font-semibold rounded-full shadow hover:bg-red-50 transition"
            >
              Go to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FailurePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FailurePageContent />
    </Suspense>
  );
}
