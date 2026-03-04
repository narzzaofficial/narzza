import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { BookModel } from "@/lib/models/Book";
import type { IBook } from "@/lib/models/Book";
import type { Book } from "@/types/content";
import { books as dummyBooks } from "@/constants/content";
import { CONTENT_REVALIDATE_SECONDS, CACHE_TAGS } from "./constants";

/**
 * Convert a raw Mongoose Book document into a plain Book object.
 * Using explicit field mapping avoids leaking internal Mongoose fields (like _id).
 */
function docToBook(d: IBook): Book {
  return {
    id: d.id,
    title: d.title,
    author: d.author,
    cover: d.cover ?? "",
    genre: d.genre ?? "",
    pages: d.pages ?? 0,
    rating: d.rating ?? 0,
    description: d.description ?? "",
    chapters: (d.chapters ?? []) as Book["chapters"],
    storyId: d.storyId ?? null,
  };
}

async function loadBooks(): Promise<Book[]> {
  try {
    const conn = await connectDB();
    if (!conn) return dummyBooks;
    const docs = await BookModel.find().sort({ id: 1 }).lean();
    // If DB is empty, fall back to in-memory dummy data
    if (docs.length === 0) return dummyBooks;
    return docs.map(docToBook);
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
  try {
    const conn = await connectDB();
    if (conn) {
      const doc = await BookModel.findOne({ id }).lean();
      if (doc) return docToBook(doc);
    }
  } catch { /* fall through to cache */ }

  // Fall back to the cached list if DB lookup fails
  const books = await getBooks();
  return books.find((b) => b.id === id) ?? null;
}

export async function getBookIds(): Promise<number[]> {
  const books = await getBooks();
  return books.map((b) => b.id);
}
