// FILE: app/(frontend)/roadmap/page.tsx

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getRoadmaps } from "@/lib/data";
import { createPageMeta } from "@/lib/metadata";

export const revalidate = 300;

export const metadata: Metadata = createPageMeta({
  title: "Roadmap Belajar Programming",
  description:
    "Koleksi roadmap belajar: frontend dasar, React lanjutan, hingga fullstack Next.js. Panduan step-by-step untuk developer.",
  path: "/roadmap",
});

export default async function RoadmapListPage() {
  const roadmaps = await getRoadmaps();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <header className="page-hero">
        <p
          className="text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: "var(--text-accent)" }}
        >
          Learning Roadmaps
        </p>
        <h1
          className="mt-2 text-3xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Pilih jalur belajar yang sesuai
        </h1>
        <p className="mt-3" style={{ color: "var(--text-secondary)" }}>
          Tiap kartu berisi urutan langkah, video embed resmi YouTube, dan fokus
          kompetensi. Klik untuk lihat detail lengkap.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 text-cyan-300">
            Semua video via YouTube embed
          </span>
          <span className="roadmap-badge-neutral rounded-full border px-3 py-1">
            Responsif mobile &amp; desktop
          </span>
        </div>
      </header>

      {/* Grid Kartu Roadmap */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {roadmaps.map((item, index) => (
          <Link
            key={item.slug}
            href={`/roadmap/${item.slug}`}
            className="feed-card glass-panel group block h-full overflow-hidden rounded-2xl ring-1 ring-white/5 transition hover:border-cyan-300/50"
            style={
              { animationDelay: `${index * 110}ms` } as React.CSSProperties
            }
          >
            {/* Image */}
            <div className="relative h-36 w-full overflow-hidden sm:h-40">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
                priority={index < 2}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
            </div>

            <div className="flex h-full flex-col gap-2 p-4">
              {/* Level & duration badges */}
              <div className="flex items-center gap-1.5">
                <span className="rounded-full bg-cyan-500 px-2.5 py-0.5 text-[10px] font-bold text-white">
                  {item.level}
                </span>
                <span className="rounded-full border border-slate-300 bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {item.duration}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 text-[10px]">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="roadmap-tag rounded-full px-2.5 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h2
                className="text-sm font-bold sm:text-base"
                style={{ color: "var(--text-primary)" }}
              >
                {item.title}
              </h2>
              <p
                className="text-xs line-clamp-2 sm:text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {item.summary}
              </p>

              <div
                className="mt-auto flex items-center justify-between text-[10px] sm:text-xs"
                style={{ color: "var(--text-accent)" }}
              >
                <span>{item.steps.length} langkah</span>
                <span className="inline-flex items-center gap-1 font-semibold group-hover:gap-2 transition-all">
                  Lihat detail →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
