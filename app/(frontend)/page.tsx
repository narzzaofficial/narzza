import { Suspense } from "react";
import type { Metadata } from "next";
import { FeedPage } from "@/components/feedpages/FeedPage";
import { getFeedPageData } from "@/lib/data";

export const revalidate = 300;

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
