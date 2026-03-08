/**
 * book-page.ts
 * Centralized data loader untuk halaman detail buku (/buku/[id]).
 * Menggantikan duplikat Promise.all di tiap page.
 */

import type { Book } from "@/types/content";
import { slugify } from "@/lib/slugify";
import { getBookById, getBooks } from "./books";

export type BookPageData = {
  book: Book;
  otherBooks: Book[];
};

export async function getBookPageData(
  id: number
): Promise<BookPageData | null> {
  const [book, allBooks] = await Promise.all([getBookById(id), getBooks()]);
  if (!book) return null;
  const otherBooks = allBooks.filter((b) => b.id !== id).slice(0, 3);
  return { book, otherBooks };
}

export async function getBookStaticIds(): Promise<number[]> {
  const books = await getBooks();
  return books.map((b) => b.id);
}

export async function getBookStaticSlugs(): Promise<string[]> {
  const books = await getBooks();
  return books
    .filter((b) => b.id != null && !isNaN(b.id))
    .map((b) => slugify(b.title, b.id));
}
