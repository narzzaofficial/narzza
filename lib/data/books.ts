import { unstable_cache } from "next/cache";
import { getDb } from "@/lib/mongodb";
import type { Book, BookChapter, ChatLine } from "@/types/content";
import { books as dummyBooks } from "@/data/content";
import { CONTENT_REVALIDATE_SECONDS, CACHE_TAGS } from "./constants";

function mapBookDoc(d: Record<string, unknown>): Book {
  return {
    id: d.id as number,
    title: d.title as string,
    author: d.author as string,
    cover: (d.cover as string) ?? "",
    genre: (d.genre as string) ?? "",
    pages: (d.pages as number) ?? 0,
    rating: (d.rating as number) ?? 0,
    description: (d.description as string) ?? "",
    chapters: ((d.chapters as BookChapter[]) ?? []).map((ch) => ({
      title: ch.title,
      lines: ch.lines as ChatLine[],
    })),
    storyId: (d.storyId as number | null | undefined) ?? null,
  };
}

async function loadBooks(): Promise<Book[]> {
  try {
    const db = await getDb();
    if (!db) return dummyBooks;
    const docs = await db.collection("books").find().sort({ id: 1 }).toArray();
    if (docs.length === 0) return dummyBooks;
    return docs.map(mapBookDoc);
  } catch {
    return dummyBooks;
  }
}

export const getBooks = unstable_cache(
  async () => loadBooks(),
  ["cached-books"],
  { revalidate: CONTENT_REVALIDATE_SECONDS, tags: [CACHE_TAGS.books] }
);

export async function getBookById(id: number): Promise<Book | null> {
  // Try direct DB first (avoids loading all books)
  try {
    const db = await getDb();
    if (db) {
      const doc = await db.collection("books").findOne({ id });
      if (doc) return mapBookDoc(doc);
    }
  } catch { /* fall through */ }

  // Fallback to cached list (covers dummy data & when DB is down)
  const books = await getBooks();
  return books.find((b) => b.id === id) ?? null;
}

export async function getBookIds(): Promise<number[]> {
  const books = await getBooks();
  return books.map((b) => b.id);
}
