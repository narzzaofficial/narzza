import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareButton } from "@/components/share-button";
import { BookCard } from "@/components/books/book-card";
import { getBookPageData, getBookStaticIds } from "@/lib/data";
import { BookHero } from "@/components/books/book-hero";
import { ChapterView } from "@/components/books/chapter-view";
import { TableOfContents } from "@/components/books/table-of-content";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = 300;

type PageProps = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const ids = await getBookStaticIds();
  return ids.map((id) => ({ id: String(id) }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getBookPageData(Number(id));
  if (!data) return { title: "Buku tidak ditemukan" };
  const { book } = data;
  return {
    title: book.title,
    description: `${book.description.slice(0, 155)}...`,
    openGraph: {
      title: `${book.title} — Narzza Media Digital`,
      description: book.description,
      images: [book.cover],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: book.title,
      description: book.description,
      images: [book.cover],
    },
    alternates: { canonical: `/buku/${id}` },
  };
}

export default async function ReadBookPage({ params }: PageProps) {
  const { id } = await params;
  const bookId = Number(id);

  if (isNaN(bookId)) notFound();

  const data = await getBookPageData(bookId);
  if (!data) notFound();
  const { book, otherBooks } = data;

  return (
    <div className="bg-canvas min-h-screen px-3 py-4 text-slate-100 md:px-5 md:py-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Book",
          name: book.title,
          author: { "@type": "Person", name: book.author },
          image: book.cover,
          description: book.description,
          genre: book.genre,
          numberOfPages: book.pages,
          url: `https://narzza.com/buku/${book.id}`,
        }}
      />
      <div className="mx-auto w-full max-w-4xl">
        {/* Header Nav */}
        <div className="mb-4 flex flex-wrap items-center gap-3 sm:justify-between">
          <Link
            href="/buku"
            className="rounded-full border border-slate-400/40 bg-slate-900/40 px-4 py-2 text-sm transition hover:border-cyan-300/50"
          >
            Semua Buku
          </Link>
          <div className="flex items-center gap-3">
            <ShareButton title={book.title} />
            <span className="rounded-full border border-cyan-300/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200">
              {book.genre}
            </span>
          </div>
        </div>

        <BookHero book={book} />

        <TableOfContents chapters={book.chapters} />

        <div className="mt-6 space-y-6">
          {book.chapters.map((chapter, i) => (
            <ChapterView
              key={i}
              chapter={chapter}
              index={i}
              totalChapters={book.chapters.length}
            />
          ))}
        </div>

        {otherBooks.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-4 text-lg font-semibold">Buku Lainnya</h2>
            <div className="grid gap-4">
              {otherBooks.map((item, i) => (
                <BookCard key={item.id} book={item} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
