import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPageContent } from "./_search";

export const metadata: Metadata = {
  title: "Cari Konten",
  description:
    "Cari berita, tutorial, buku, dan konten lainnya di Narzza Media Digital.",
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <SearchPageContent />
    </Suspense>
  );
}
