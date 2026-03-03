import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cari Konten",
  description: "Cari berita, tutorial, buku, dan konten lainnya di Narzza Media Digital.",
  robots: { index: false, follow: true },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

