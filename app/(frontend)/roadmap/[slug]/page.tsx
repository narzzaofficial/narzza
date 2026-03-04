// FILE: app/(frontend)/roadmap/[slug]/page.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRoadmaps, getRoadmapBySlug } from "@/lib/data";
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
  const roadmap = await getRoadmapBySlug(slug);
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
    twitter: {
      card: "summary_large_image",
      title: roadmap.title,
      description: roadmap.summary,
    },
    alternates: { canonical: `/roadmap/${slug}` },
  };
}

export default async function RoadmapDetailPage({
  params,
}: RoadmapDetailPageProps) {
  const { slug } = await params;
  const roadmap = await getRoadmapBySlug(slug);
  if (!roadmap) notFound();

  return (
    <div className="flex flex-1 flex-col">
      <RoadmapCourseViewer roadmap={roadmap} />
    </div>
  );
}
