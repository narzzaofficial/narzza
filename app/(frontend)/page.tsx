import { Suspense } from "react";
import type { Metadata } from "next";
import { FeedPage } from "@/components/feedpages/FeedPage";

export const metadata: Metadata = {
  title: "Berita, Tutorial & Eksperimen Teknologi | Narzza Media Digital",
  description:
    "Baca berita teknologi, tutorial coding, dan eksperimen koding dalam format chat interaktif. Topik panjang jadi santai dan mudah dicerna.",
  openGraph: {
    title: "Narzza Media Digital — Berita & Tutorial Teknologi",
    description:
      "Portal berita teknologi, tutorial, dan eksperimen koding dalam format chat interaktif.",
    url: "https://narzza.com",
    type: "website",
  },
  alternates: { canonical: "/" },
};
// Import semua dari centralized data layer
import {
  getFeeds,
  getStories,
  getBooks,
  getRoadmaps,
  getProducts,
} from "@/lib/data";

// Revalidate data setiap 5 menit (ISR)
export const revalidate = 300;

export default async function HomePage() {
  // 🚀 Parallel Fetching langsung ke Database
  const [feeds, stories, books, roadmaps, products] = await Promise.all([
    getFeeds(),
    getStories(),
    getBooks(),
    getRoadmaps(),
    getProducts(),
  ]);

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
