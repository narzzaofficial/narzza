import Link from "next/link";
import React from "react";

const HeroTentang = () => {
  return (
    <header className="glass-panel overflow-hidden rounded-3xl shadow-xl shadow-cyan-500/5 ring-1 ring-white/5">
      <div className="bg-linear-to-br from-cyan-500/10 to-blue-600/10 p-8 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
          Tentang Narzza
        </p>
        <h1 className="mt-2 text-4xl font-bold text-slate-50 md:text-5xl">
          Platform Media Digital untuk Semua
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-200">
          Narzza adalah{" "}
          <strong className="text-cyan-300">platform penyedia informasi umum</strong>{" "}
          yang menghadirkan berita, tutorial, dan riset dari berbagai bidang
          dalam format yang mudah dipahami. Kami percaya setiap orang berhak
          mendapatkan informasi berkualitas secara cepat dan menyenangkan.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/berita"
            className="rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400"
          >
            Baca Konten Kami
          </Link>
          <Link
            href="/toko"
            className="rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-6 py-3 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/60 hover:bg-cyan-500/20"
          >
            Lihat Produk
          </Link>
        </div>
      </div>
    </header>
  );
};

export default HeroTentang;
