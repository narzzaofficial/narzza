import { Suspense } from "react";
import { notFound } from "next/navigation";
import { DetailShell } from "@/components/navigation/DetailShell";
import {
  BookRecommendSidebarLeft,
  BookRecommendSidebarRight,
} from "@/components/navigation/BookRecommendSidebar";
import { parseSlugId, slugifyBase } from "@/lib/slugify";
import { getBooks } from "@/lib/data";

type Props = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export default async function BukuDetailLayout({ children, params }: Props) {
  const { id } = await params;

  // Coba resolve numeric ID dari slug (e.g. "clean-code-1" → 1)
  let bookId = parseSlugId(id);

  // Fallback: cari by title slug kalau tidak ada ID di slug
  if (!bookId) {
    const all = await getBooks();
    const titlePart = id.replace(/-\d+$/, "").replace(/-undefined$/, "");
    const match = all.find((b) => slugifyBase(b.title) === titlePart);
    if (!match) notFound();
    bookId = match.id;
  }

  return (
    <DetailShell
      leftSidebar={
        <Suspense
          fallback={<div className="sidebar-widget animate-pulse h-64" />}
        >
          <BookRecommendSidebarLeft currentId={bookId} />
        </Suspense>
      }
      rightSidebar={
        <Suspense
          fallback={<div className="sidebar-widget animate-pulse h-64" />}
        >
          <BookRecommendSidebarRight currentId={bookId} />
        </Suspense>
      }
    >
      {children}
    </DetailShell>
  );
}
