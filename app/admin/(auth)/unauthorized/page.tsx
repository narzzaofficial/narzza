import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-slate-900 p-8 text-center shadow-2xl">
        <div className="mb-4 text-5xl">🚫</div>
        <h1 className="mb-2 text-2xl font-bold text-slate-100">
          Akses Ditolak
        </h1>
        <p className="mb-6 text-sm text-slate-400">
          Akun kamu tidak memiliki izin untuk mengakses Admin Panel.
          Hanya akun yang terdaftar yang diizinkan masuk.
        </p>
        <div className="flex flex-col gap-3">
          <SignOutButton redirectUrl="/admin/sign-in">
            <button className="w-full rounded-xl bg-red-600/80 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500">
              Sign Out
            </button>
          </SignOutButton>
          <Link
            href="/"
            className="w-full rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-slate-100"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

