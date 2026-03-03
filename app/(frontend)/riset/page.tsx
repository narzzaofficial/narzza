import { Suspense } from "react";
import type { Metadata } from "next";
import { FeedPage } from "@/components/feedpages/FeedPage";
import { getFeedPageData } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Riset & Eksperimen Koding",
  description:
    "Analisa mendalam dan eksperimen koding terbaru. Temukan insight teknis dari riset dan percobaan langsung.",
  openGraph: {
    title: "Riset & Eksperimen Koding — Narzza Media Digital",
    description:
      "Analisa mendalam dan eksperimen koding dalam format chat interaktif.",
    url: "https://narzza.com/riset",
    type: "website",
  },
  alternates: { canonical: "/riset" },
};

export default async function RisetPage() {
  const { feeds, stories, books, roadmaps, products } =
    await getFeedPageData("Riset");

  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
      <FeedPage
        activePath="/riset"
        badge="RISET"
        title="Riset & Eksperimen"
        description="Analisa mendalam dan eksperimen koding."
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
