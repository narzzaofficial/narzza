import { Suspense } from "react";
import type { Metadata } from "next";
import { FeedPage } from "@/components/feedpages/FeedPage";
import { getFeedPageData } from "@/lib/data";
import { createPageMeta } from "@/lib/metadata";

export const revalidate = 300;

export const metadata: Metadata = createPageMeta({
  title: "Tutorial & Panduan",
  description:
    "Panduan praktis langkah demi langkah dari berbagai topik. Pelajari hal-hal baru dengan cara yang mudah dan menyenangkan.",
  path: "/tutorial",
});

export default async function TutorialPage() {
  const { feeds, stories, books, roadmaps, products } =
    await getFeedPageData("Tutorial");

  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
      <FeedPage
        activePath="/tutorial"
        badge="TUTORIAL"
        title="Tutorial & Panduan"
        description="Panduan praktis langkah demi langkah dari berbagai topik."
        category="Tutorial"
        initialFeeds={feeds}
        initialStories={stories}
        initialBooks={books}
        initialRoadmaps={roadmaps}
        initialProducts={products}
      />
    </Suspense>
  );
}
