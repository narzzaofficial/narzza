import { Suspense } from "react";
import type { Metadata } from "next";
import { FeedPage } from "@/components/feedpages/FeedPage";
import { getFeedPageData } from "@/lib/data";
import { createPageMeta } from "@/lib/metadata";

export const revalidate = 300;

export const metadata: Metadata = createPageMeta({
  title: "Berita Terkini",
  description:
    "Informasi dan berita terkini dari berbagai topik, disajikan dalam format yang mudah dipahami dan cepat dicerna.",
  path: "/berita",
});

export default async function BeritaPage() {
  const { feeds, stories, books, roadmaps, products } =
    await getFeedPageData("Berita");

  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
      <FeedPage
        activePath="/berita"
        badge="BERITA"
        title="Berita Terkini"
        description="Informasi dan berita terkini dari berbagai topik."
        category="Berita"
        initialFeeds={feeds}
        initialStories={stories}
        initialBooks={books}
        initialRoadmaps={roadmaps}
        initialProducts={products}
      />
    </Suspense>
  );
}
