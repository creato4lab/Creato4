'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error for monitoring (Sentry, LogRocket, etc. can be added here)
    console.error('Application error:', error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FAF8F5] px-6">
      <div className="text-center max-w-lg">
        {/* Error Code */}
        <div className="relative mb-8">
          <span className="text-[10rem] sm:text-[14rem] font-black text-[#1A3C2F]/[0.04] leading-none select-none block">
            500
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1A3C2F] mb-4 tracking-tight">
          Something Went Wrong
        </h1>
        <p className="text-[#5C6B60] text-sm sm:text-base mb-8 leading-relaxed">
          We encountered an unexpected error. Our team has been notified.
          Please try again or return to the homepage.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1A3C2F] text-[#FAF8F5] text-sm font-bold tracking-wide hover:bg-[#234B3C] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-[#1A3C2F] text-[#1A3C2F] text-sm font-bold tracking-wide hover:bg-[#1A3C2F] hover:text-[#FAF8F5] transition-all"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Error ID for support */}
        {error.digest && (
          <p className="mt-8 text-xs text-[#5C6B60]/50 font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}
