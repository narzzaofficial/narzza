import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { BookModel } from "@/lib/models/Book";
import type { IBook } from "@/lib/models/Book";
import type { Book } from "@/types/content";
import { CONTENT_REVALIDATE_SECONDS, CACHE_TAGS } from "../constants";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Convert raw Mongoose Book document → plain Book object.
 * Explicit field mapping menghindari leak internal Mongoose fields (_id, dll).
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

// ─── Private loaders ─────────────────────────────────────────────────────────

async function loadBooks(): Promise<Book[]> {
  try {
    const conn = await connectDB();
    if (!conn) return [];

    const docs = await BookModel.find().sort({ id: 1 }).lean();
    return docs.map(docToBook);
  } catch (error) {
    console.error("❌ loadBooks error:", error);
    return [];
  }
}

async function loadBookById(id: number): Promise<Book | null> {
  try {
    const conn = await connectDB();
    if (!conn) return null;

    const doc = await BookModel.findOne({ id }).lean();
    return doc ? docToBook(doc) : null;
  } catch (error) {
    console.error("❌ loadBookById error:", error);
    return null;
  }
}

// ─── Cached exports ───────────────────────────────────────────────────────────

export const getBooks = unstable_cache(
  async () => loadBooks(),
  ["cached-books"],
  { revalidate: CONTENT_REVALIDATE_SECONDS, tags: [CACHE_TAGS.books] }
);

export const getBookById = unstable_cache(
  async (id: number) => loadBookById(id),
  ["cached-book-by-id"],
  { revalidate: CONTENT_REVALIDATE_SECONDS, tags: [CACHE_TAGS.books] }
);
