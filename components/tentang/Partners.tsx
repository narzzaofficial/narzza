import Link from "next/link";
import React from "react";

const Partners = () => {
  return (
    <section className="glass-panel overflow-hidden rounded-2xl ring-1 ring-white/5">
      <div className="bg-linear-to-br from-cyan-500/10 to-blue-600/10 p-6">
        <h2 className="mb-1 text-2xl font-bold text-slate-50">
          Jadilah Bagian dari Narzza
        </h2>
        <p className="mb-6 text-sm text-slate-400">
          Platform kami masih terus berkembang — eksplorasi konten, bagikan
          masukan, dan tumbuh bersama komunitas kami.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/berita"
            className="rounded-lg border border-transparent bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-400"
          >
            Mulai Membaca
          </Link>
          <Link
            href="/laporkan-bug"
            className="rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-5 py-2.5 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/60 hover:bg-cyan-500/20"
          >
            Beri Masukan
          </Link>
          <Link
            href="/rekomendasikan"
            className="rounded-lg border border-slate-600/60 bg-slate-800/60 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/50 hover:text-cyan-100"
          >
            Rekomendasikan Topik
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Partners;
