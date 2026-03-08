import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareButton } from "@/components/share-button";
import { BookCard } from "@/components/books/book-card";
import { BookHero } from "@/components/books/book-hero";
import { ChapterView } from "@/components/books/chapter-view";
import { TableOfContents } from "@/components/books/table-of-content";
import { JsonLd } from "@/components/JsonLd";
import { parseSlugId, slugify, slugifyBase } from "@/lib/slugify";
import { getBooks, getBookPageData, getBookStaticSlugs } from "@/lib/data";

// ✅ Tidak ada revalidate — generateStaticParams sudah cukup untuk SSG
export const dynamicParams = true;

type PageProps = { params: Promise<{ id: string }> };

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Resolve book dari slug/id param.
 * Urutan lookup:
 * 1. Parse numeric ID dari slug → getBookPageData(id)
 * 2. Match by exact slug
 * 3. Fuzzy match by title slug (tanpa trailing ID)
 */
async function resolveBook(param: string) {
  // 1. Cari by numeric ID
  const parsedId = parseSlugId(param);
  if (parsedId) {
    const data = await getBookPageData(parsedId);
    if (data) return data;
  }

  // 2 & 3. Fallback — cari by slug atau title
  const all = await getBooks();
  const titlePart = param.replace(/-\d+$/, "").replace(/-undefined$/, "");

  const book =
    all.find((b) => slugify(b.title, b.id) === param) ??
    all.find((b) => slugifyBase(b.title) === titlePart);

  if (!book) return null;

  return {
    book,
    otherBooks: all.filter((b) => b.id !== book.id).slice(0, 3),
  };
}

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const slugs = await getBookStaticSlugs();
  return slugs.map((id) => ({ id }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await resolveBook(id);
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ReadBookPage({ params }: PageProps) {
  const { id } = await params;
  const data = await resolveBook(id);
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
          url: `/buku/${slug}`,
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
