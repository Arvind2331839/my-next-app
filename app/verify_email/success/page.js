"use client";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 opacity-20 blur-xl"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-green-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-green-800 mb-2">
            Email Verified Successfully ✅
          </h1>
          <p className="text-gray-700 mb-6">
            Your email has been successfully verified. You can now log in.
          </p>
          <a
            href="/login"
            className="inline-block px-6 py-2 bg-green-600 text-white font-semibold rounded-full shadow hover:bg-green-700 transition"
          >
            Go to Login
          </a>
        </div>
      </div>
    </div>
  );
}
