import { PLATFORM_FEATURES } from "@/constants/about";
import React from "react";

const TechnologyStack = () => {
  return (
    <section className="glass-panel rounded-2xl p-6 ring-1 ring-white/5">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-slate-50">Layanan Platform</h2>
        <p className="mt-1 text-sm text-slate-400">
          Berbagai jenis konten dan layanan yang tersedia di Narzza
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PLATFORM_FEATURES.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4 transition hover:border-cyan-500/40 hover:bg-slate-800/60"
          >
            <div className="mb-2 text-2xl">{item.icon}</div>
            <p className="font-semibold text-slate-50">{item.label}</p>
            <p className="mt-1 text-xs text-slate-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechnologyStack;
