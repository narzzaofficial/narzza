import { Suspense } from "react";
import { notFound } from "next/navigation";
import { DetailShell } from "@/components/navigation/DetailShell";
import {
  BookRecommendSidebarLeft,
  BookRecommendSidebarRight,
} from "@/components/navigation/BookRecommendSidebar";

type Props = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export default async function BukuDetailLayout({ children, params }: Props) {
  const { id } = await params;
  const bookId = Number(id);
  if (Number.isNaN(bookId)) notFound();

  return (
    <DetailShell
      leftSidebar={
        <Suspense fallback={<div className="sidebar-widget animate-pulse h-64" />}>
          <BookRecommendSidebarLeft currentId={bookId} />
        </Suspense>
      }
      rightSidebar={
        <Suspense fallback={<div className="sidebar-widget animate-pulse h-64" />}>
          <BookRecommendSidebarRight currentId={bookId} />
        </Suspense>
      }
    >
      {children}
    </DetailShell>
  );
}

