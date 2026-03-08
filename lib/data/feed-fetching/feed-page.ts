/**
 * feed-page.ts
 * Centralized data loader untuk semua halaman feed.
 *
 * Gunakan fungsi yang tepat sesuai kebutuhan halaman:
 * - getFeedPageData()  → Homepage saja (butuh semua data)
 * - getCategoryFeeds() → /berita, /tutorial, /riset (cukup feeds)
 */

import type { FeedCategory } from "@/types/content";
import { getFeeds } from "./feeds";
import { getStories } from "../stories";
import { getBooks } from "../book-fetching/books";
import { getRoadmaps } from "../roadmaps";
import { getProducts } from "../products";

// ─── Types ────────────────────────────────────────────────────────────────────

export type FeedPageData = {
  feeds: Awaited<ReturnType<typeof getFeeds>>;
  stories: Awaited<ReturnType<typeof getStories>>;
  books: Awaited<ReturnType<typeof getBooks>>;
  roadmaps: Awaited<ReturnType<typeof getRoadmaps>>;
  products: Awaited<ReturnType<typeof getProducts>>;
};

export type CategoryPageData = {
  feeds: Awaited<ReturnType<typeof getFeeds>>;
};

// ─── Homepage loader ──────────────────────────────────────────────────────────

/**
 * Load SEMUA data yang dibutuhkan Homepage secara paralel.
 * Jangan gunakan ini untuk /berita, /tutorial, /riset — terlalu boros.
 */
export async function getFeedPageData(): Promise<FeedPageData> {
  const [feeds, stories, books, roadmaps, products] = await Promise.all([
    getFeeds(),
    getStories(),
    getBooks(),
    getRoadmaps(),
    getProducts(),
  ]);
  return { feeds, stories, books, roadmaps, products };
}

// ─── Category page loader ─────────────────────────────────────────────────────

/**
 * Load feeds untuk halaman kategori (/berita, /tutorial, /riset).
 * Hanya 1 DB call — tidak fetch stories/books/roadmaps/products yang tidak dipakai.
 */
export async function getCategoryFeeds(
  category: FeedCategory
): Promise<CategoryPageData> {
  const feeds = await getFeeds(category);
  return { feeds };
}