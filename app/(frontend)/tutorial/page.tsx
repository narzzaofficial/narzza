import { Suspense } from "react";
import type { Metadata } from "next";
import { FeedPage } from "@/components/feedpages/FeedPage";
import { getFeeds, getStories, getBooks } from "@/lib/data";

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

async function getInternalData(endpoint: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/${endpoint}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    return [];
  }
}

export default async function TutorialPage() {
  const [feeds, stories, books, roadmaps, products] = await Promise.all([
    getFeeds("Tutorial"),
    getStories(),
    getBooks(),
    getInternalData("roadmaps"),
    getInternalData("products"),
  ]);

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
