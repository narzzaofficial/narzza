import { Suspense } from "react";
import type { Metadata } from "next";
import { FeedPage } from "@/components/feedpages/FeedPage";

import { createPageMeta } from "@/lib/metadata";
import { getCategoryFeeds } from "@/lib/data/feed-fetching/feed-page";

export const revalidate = 1800; // ISR: rerender background setiap 30 menit

export const metadata: Metadata = createPageMeta({
  title: "Berita Terkini",
  description:
    "Informasi dan berita terkini dari berbagai topik, disajikan dalam format yang mudah dipahami dan cepat dicerna.",
  path: "/berita",
});

export default async function BeritaPage() {
  const { feeds } = await getCategoryFeeds("Berita");

  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
      <FeedPage
        activePath="/berita"
        badge="BERITA"
        title="Berita Terkini"
        description="Informasi dan berita terkini dari berbagai topik."
        category="Berita"
        initialFeeds={feeds}
        initialStories={[]}
        initialBooks={[]}
        initialRoadmaps={[]}
        initialProducts={[]}
      />
    </Suspense>
  );
}
