import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareButton } from "@/components/share-button";
import { BookCard } from "@/components/books/book-card";
import { getBookStaticSlugs, getBooks } from "@/lib/data";
import { BookHero } from "@/components/books/book-hero";
import { ChapterView } from "@/components/books/chapter-view";
import { TableOfContents } from "@/components/books/table-of-content";
import { JsonLd } from "@/components/JsonLd";
import { parseSlugId, slugify, slugifyBase } from "@/lib/slugify";

export const revalidate = 300;
export const dynamicParams = true;

type PageProps = { params: Promise<{ id: string }> };

async function loadBookData(param: string) {
  const all = await getBooks();

  // 1. Match by numeric id parsed from slug end (e.g. "judul-buku-1" → id 1)
  const parsedId = parseSlugId(param);
  if (parsedId) {
    const byId = all.find((b) => b.id === parsedId);
    if (byId) {
      return { book: byId, otherBooks: all.filter((b) => b.id !== byId.id).slice(0, 3) };
    }
  }

  // 2. Match by exact slug  (slugify(title, id) === param)
  const bySlug = all.find((b) => slugify(b.title, b.id) === param);
  if (bySlug) {
    return { book: bySlug, otherBooks: all.filter((b) => b.id !== bySlug.id).slice(0, 3) };
  }

  // 3. Fuzzy: match title-only slug, ignoring the trailing id number
  //    Handles case where DB ids differ from URL ids but title matches
  const titlePart = param.replace(/-\d+$/, "").replace(/-undefined$/, "");
  const byTitle = all.find((b) => slugifyBase(b.title) === titlePart);
  if (byTitle) {
    return { book: byTitle, otherBooks: all.filter((b) => b.id !== byTitle.id).slice(0, 3) };
  }

  return null;
}

export async function generateStaticParams() {
  const slugs = await getBookStaticSlugs();
  return slugs.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await loadBookData(id);
  if (!data) return { title: "Buku tidak ditemukan" };
  const { book } = data;
  const slug = slugify(book.title, book.id);
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
    alternates: { canonical: `/buku/${slug}` },
  };
}

export default async function ReadBookPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadBookData(id);
  if (!data) notFound();
  const { book, otherBooks } = data;
  const slug = slugify(book.title, book.id);

  return (
    <>
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
          url: `https://narzza.com/buku/${slug}`,
        }}
      />
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
    </>
  );
}
