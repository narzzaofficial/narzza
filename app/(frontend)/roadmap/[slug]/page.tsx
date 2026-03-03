// FILE: app/(frontend)/roadmap/[slug]/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRoadmaps } from "@/lib/data";
import { RoadmapCourseViewer } from "@/components/roadmap/RoadmapCourseViewer";

export const revalidate = 300;

type RoadmapDetailPageProps = {
  params: Promise<{ slug: string }>;
};

// Generate Slug Statis (Agar cepat)
export async function generateStaticParams() {
  const roadmaps = await getRoadmaps();
  return roadmaps.map((r) => ({ slug: r.slug }));
}

// Generate Metadata (Judul Tab Browser)
export async function generateMetadata({
  params,
}: RoadmapDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const roadmaps = await getRoadmaps();
  const roadmap = roadmaps.find((r) => r.slug === slug);

  if (!roadmap) return { title: "Roadmap tidak ditemukan" };

  return {
    title: `${roadmap.title} | Roadmap Belajar`,
    description: roadmap.summary,
  };
}

// KOMPONEN UTAMA (Wajib export default function)
export default async function RoadmapDetailPage({
  params,
}: RoadmapDetailPageProps) {
  const { slug } = await params;
  const roadmaps = await getRoadmaps();
  const current = roadmaps.find((r) => r.slug === slug);

  if (!current) {
    notFound();
  }

  return (
    <>
      {/* Back button */}
      <div className="mb-4">
        <Link href="/roadmap" className="detail-back-btn">
          ← Semua Roadmap
        </Link>
      </div>

      <div className="space-y-5">
        {/* Hero header */}
        <header className="page-hero">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Learning Roadmap
              </p>
              <h1 className="mt-2 text-2xl font-bold text-slate-50 md:text-3xl">
                {current.title}
              </h1>
              <p className="mt-2 text-sm text-slate-300">{current.summary}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 font-semibold text-cyan-200">
                {current.level}
              </span>
              <span className="roadmap-badge-neutral rounded-full border px-3 py-1">
                {current.duration}
              </span>
            </div>
          </div>
          {current.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
              {current.tags.map((tag) => (
                <span key={tag} className="roadmap-tag rounded-full px-2.5 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Coursera-style course viewer */}
        <RoadmapCourseViewer roadmap={current} />
      </div>
    </>
  );
}
