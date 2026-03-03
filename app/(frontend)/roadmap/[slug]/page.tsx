// FILE: app/(frontend)/roadmap/[slug]/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRoadmaps } from "@/lib/data";
import { RoadmapCourseViewer } from "@/components/roadmap/RoadmapCourseViewer";

export const revalidate = 300;

type RoadmapDetailPageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const roadmaps = await getRoadmaps();
  return roadmaps.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: RoadmapDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const roadmaps = await getRoadmaps();
  const roadmap = roadmaps.find((r) => r.slug === slug);
  if (!roadmap) return { title: "Roadmap tidak ditemukan" };
  return {
    title: roadmap.title,
    description: roadmap.summary,
    openGraph: {
      title: `${roadmap.title} — Roadmap Belajar`,
      description: roadmap.summary,
      images: roadmap.image ? [roadmap.image] : [],
      type: "article",
    },
    twitter: { card: "summary_large_image", title: roadmap.title, description: roadmap.summary },
    alternates: { canonical: `/roadmap/${slug}` },
  };
}

export default async function RoadmapDetailPage({
  params,
}: RoadmapDetailPageProps) {
  const { slug } = await params;
  const roadmaps = await getRoadmaps();
  const current = roadmaps.find((r) => r.slug === slug);
  if (!current) notFound();

  return (
    <div className="space-y-4">
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/roadmap" className="detail-back-btn">
          ← Semua Roadmap
        </Link>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--text-accent)" }}>
            Learning Roadmap
          </span>
          <span className="text-slate-500">•</span>
          <span className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 font-semibold text-cyan-300">
            {current.level}
          </span>
          <span
            className="rounded-full border px-3 py-1"
            style={{ borderColor: "var(--surface-border)", color: "var(--text-secondary)" }}
          >
            {current.duration}
          </span>
        </div>
      </div>

      {/* ── Title ───────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold md:text-3xl" style={{ color: "var(--text-primary)" }}>
          {current.title}
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          {current.summary}
        </p>
        {current.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {current.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-2.5 py-0.5 text-[11px]"
                style={{ background: "rgba(6,182,212,0.1)", color: "var(--text-accent)", border: "1px solid rgba(6,182,212,0.25)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Coursera-style viewer ───────────────────────────────── */}
      <RoadmapCourseViewer roadmap={current} />
    </div>
  );
}
