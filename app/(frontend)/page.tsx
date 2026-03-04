import { Suspense } from "react";
import type { Metadata } from "next";
import { FeedPage } from "@/components/feedpages/FeedPage";
import { getFeedPageData } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Berita, Tutorial & Riset | Narzza Media Digital",
  description:
    "Platform media digital yang menyajikan informasi dari berbagai bidang dalam format interaktif dan mudah dipahami. Baca topik panjang jadi santai.",
  openGraph: {
    title: "Narzza Media Digital — Informasi dari Berbagai Bidang",
    description:
      "Platform media digital yang menyajikan berita, tutorial, dan riset dari berbagai bidang dalam format interaktif.",
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
