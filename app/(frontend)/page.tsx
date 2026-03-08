import { Suspense } from "react";
import type { Metadata } from "next";
import { FeedPage } from "@/components/feedpages/FeedPage";
import { getFeedPageData } from "@/lib/data";
import { createPageMeta } from "@/lib/metadata";

export const metadata: Metadata = createPageMeta({
  title: "Berita, Tutorial & Riset",
  description:
    "Platform media digital yang menyajikan informasi dari berbagai bidang dalam format interaktif dan mudah dipahami. Baca topik panjang jadi santai.",
  path: "/",
});

export default async function HomePage() {
  const { feeds, stories, books, roadmaps, products } = await getFeedPageData();

  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
      <FeedPage
        activePath="/"
        badge="Narzza Media Digital"
        title="Berita, tutorial, dan eksperimen dalam format chat"
        description="Baca topik panjang jadi lebih santai: pertanyaan singkat, jawaban padat, dan inti cepat per konten."
        showStories={true}
        initialFeeds={feeds}
        initialStories={stories}
        initialBooks={books}
        initialRoadmaps={roadmaps}
        initialProducts={products}
      />
    </Suspense>
  );
}
