import { Suspense } from "react";
import type { Metadata } from "next";
import { FeedPage } from "@/components/feedpages/FeedPage";
import { getFeedPageData } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Tutorial & Panduan Coding",
  description:
    "Langkah demi langkah menguasai teknologi baru lewat tutorial interaktif. Dari frontend hingga backend, semua ada di sini.",
  openGraph: {
    title: "Tutorial & Panduan Coding — Narzza Media Digital",
    description:
      "Tutorial coding langkah demi langkah dalam format chat interaktif.",
    url: "https://narzza.com/tutorial",
    type: "website",
  },
  alternates: { canonical: "/tutorial" },
};

export default async function TutorialPage() {
  const { feeds, stories, books, roadmaps, products } =
    await getFeedPageData("Tutorial");

  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
      <FeedPage
        activePath="/tutorial"
        badge="TUTORIAL"
        title="Tutorial & Panduan"
        description="Langkah demi langkah menguasai teknologi baru."
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
