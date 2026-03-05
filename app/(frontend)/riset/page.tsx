import { Suspense } from "react";
import type { Metadata } from "next";
import { FeedPage } from "@/components/feedpages/FeedPage";
import { getFeedPageData } from "@/lib/data";
import { createPageMeta } from "@/lib/metadata";

export const revalidate = 300;

export const metadata: Metadata = createPageMeta({
  title: "Riset & Eksperimen",
  description:
    "Analisa mendalam, temuan menarik, dan eksperimen dari berbagai bidang. Temukan insight dari riset yang disajikan secara ringkas.",
  path: "/riset",
});

export default async function RisetPage() {
  const { feeds, stories, books, roadmaps, products } =
    await getFeedPageData("Riset");

  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
      <FeedPage
        activePath="/riset"
        badge="RISET"
        title="Riset & Eksperimen"
        description="Analisa mendalam dan temuan menarik dari berbagai bidang."
        category="Riset"
        initialFeeds={feeds}
        initialStories={stories}
        initialBooks={books}
        initialRoadmaps={roadmaps}
        initialProducts={products}
      />
    </Suspense>
  );
}
