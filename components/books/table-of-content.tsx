import type { BookChapter } from "@/types/content";
import { ChevronRightIcon } from "./icons";

export function TableOfContents({ chapters }: { chapters: BookChapter[] }) {
  return (
    <section className="glass-panel mt-6 rounded-3xl p-4 md:p-6">
      <header className="mb-4 border-b border-slate-700/70 pb-3">
        <h2 className="text-lg font-bold text-slate-50 md:text-xl">
          📖 Daftar Isi
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          {chapters.length} bab tersedia
        </p>
      </header>
      <div className="grid gap-2.5 md:grid-cols-2">
        {chapters.map((chapter, i) => (
          <a
            key={i}
            href={`#chapter-${i}`}
            className="group flex min-w-0 items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-900/30 px-3.5 py-3 text-sm transition hover:border-cyan-300/50 hover:bg-cyan-500/5"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-xs font-bold text-cyan-300 ring-1 ring-cyan-500/20 transition group-hover:bg-cyan-500/15 group-hover:ring-cyan-400/30">
              {i + 1}
            </span>
            <span className="flex-1 min-w-0 text-slate-200 transition group-hover:text-cyan-200 truncate">
              {chapter.title}
            </span>
            <ChevronRightIcon />
          </a>
        ))}
      </div>
    </section>
  );
}
