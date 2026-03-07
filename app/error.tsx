"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error caught by error boundary:", error);
  }, [error]);

  return (
    <div className="page-center">
      <div className="mx-auto w-full max-w-lg text-center">
        <div className="glass-panel">
          {/* icon */}
          <div className="error-icon-wrapper">
            <div className="error-icon-circle">
              <svg
                className="h-16 w-16 text-rose-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
          </div>

          {/* title */}
          <h1 className="error-title">Oops! Terjadi Kesalahan</h1>

          {/* text */}
          <p className="error-text">
            Maaf, terjadi kesalahan yang tidak terduga.
          </p>

          {/* dev error */}
          {process.env.NODE_ENV === "development" && (
            <div className="error-dev-box">
              <p className="text-xs font-semibold text-rose-300">
                Error Details
              </p>

              <p className="text-xs font-mono text-rose-200">{error.message}</p>
            </div>
          )}

          {/* buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button onClick={() => reset()} className="btn-primary">
              🔄 Coba Lagi
            </button>

            <Link href="/" className="btn-secondary">
              ← Kembali ke Beranda
            </Link>
          </div>

          {/* help */}
          <div className="mt-8 border-t border-slate-700/60 pt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Butuh Bantuan?
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              <Link href="/tentang" className="chip-link">
                📧 Hubungi Kami
              </Link>

              <Link href="/" className="chip-link">
                🏠 Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
