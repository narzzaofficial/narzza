import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { FeedModel } from "@/lib/models/Feed";
import type { IFeed } from "@/lib/models/Feed";
import type { Feed } from "@/types/content";
import { CONTENT_REVALIDATE_SECONDS, CACHE_TAGS } from "../constants";
import { slugify, parseSlugId } from "@/lib/slugify";

// ─── Jumlah maksimum feed yang di-fetch untuk list/feed page ─────────────────
const FEED_LIST_LIMIT = 50;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Convert raw Mongoose Feed document → plain Feed object.
 * `lines` akan kosong ([]) di list view karena di-exclude via .select("-lines").
 * `previewLines` dan `lineCount` dipakai sebagai gantinya di TutorialCard.
 */
function docToFeed(d: IFeed): Feed {
  return {
    id: d.id,
    slug: d.slug || slugify(d.title, d.id),
    title: d.title,
    category: d.category as Feed["category"],
    createdAt: d.createdAt ?? Date.now(),
    popularity: d.popularity ?? 0,
    image: d.image ?? "",
    lines: (d.lines ?? []) as Feed["lines"],
    lineCount: d.lineCount ?? 0,
    previewLines: (d.previewLines ?? []) as Feed["lines"],
    takeaway: d.takeaway ?? "",
    author: d.author ?? "",
    source: d.source as Feed["source"],
    storyId: d.storyId ?? null,
  };
}

// ─── Private loaders ─────────────────────────────────────────────────────────

/**
 * Load feed list dari DB.
 * - Exclude `lines` (berat) — diganti previewLines + lineCount untuk list view
 * - Dibatasi FEED_LIST_LIMIT dokumen
 */
async function loadFeeds(category?: Feed["category"]): Promise<Feed[]> {
  try {
    const conn = await connectDB();
    if (!conn) return [];

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;

    const docs = await FeedModel.find(filter)
      .select("-lines")
      .sort({ createdAt: -1 })
      .limit(FEED_LIST_LIMIT)
      .lean();

    return docs.map(docToFeed);
  } catch (error) {
    console.error("❌ loadFeeds error:", error);
    return [];
  }
}

/**
 * Load single feed by numeric ID.
 * Include SEMUA field (lines, dll) untuk detail page.
 */
async function loadFeedById(id: number): Promise<Feed | null> {
  try {
    const conn = await connectDB();
    if (!conn) return null;

    const doc = await FeedModel.findOne({ id }).lean();
    return doc ? docToFeed(doc) : null;
  } catch (error) {
    console.error("❌ loadFeedById error:", error);
    return null;
  }
}

/**
 * Load similar feeds berdasarkan kategori, exclude artikel yang sedang dibaca.
 * Query langsung ke DB — tidak perlu load semua feed lalu filter di client.
 */
async function loadSimilarFeeds(
  category: Feed["category"],
  excludeId: number
): Promise<Feed[]> {
  try {
    const conn = await connectDB();
    if (!conn) return [];

    const docs = await FeedModel.find({
      category,
      id: { $ne: excludeId },
    })
      .select("-lines")
      .sort({ popularity: -1 })
      .limit(8)
      .lean();

    return docs.map(docToFeed);
  } catch (error) {
    console.error("❌ loadSimilarFeeds error:", error);
    return [];
  }
}

// ─── Cached exports ───────────────────────────────────────────────────────────

export const getFeeds = unstable_cache(
  async (category?: Feed["category"]) => loadFeeds(category),
  ["cached-feeds"],
  { revalidate: CONTENT_REVALIDATE_SECONDS, tags: [CACHE_TAGS.feeds] }
);

export const getFeedById = unstable_cache(
  async (id: number) => loadFeedById(id),
  ["cached-feed-by-id"],
  { revalidate: CONTENT_REVALIDATE_SECONDS, tags: [CACHE_TAGS.feeds] }
);

export const getSimilarFeeds = unstable_cache(
  async (category: Feed["category"], excludeId: number) =>
    loadSimilarFeeds(category, excludeId),
  ["cached-similar-feeds"],
  { revalidate: CONTENT_REVALIDATE_SECONDS, tags: [CACHE_TAGS.feeds] }
);

// ─── Non-cached (per-request) ─────────────────────────────────────────────────

export async function getFeedBySlug(slug: string): Promise<Feed | null> {
  try {
    const conn = await connectDB();
    if (!conn) return null;

    const doc = await FeedModel.findOne({ slug }).lean();
    if (doc) return docToFeed(doc);

    const id = parseSlugId(slug);
    if (id !== null) {
      const docById = await FeedModel.findOne({ id }).lean();
      return docById ? docToFeed(docById) : null;
    }

    return null;
  } catch (error) {
    console.error("❌ getFeedBySlug error:", error);
    return null;
  }
}

export async function getFeedSlugs(): Promise<string[]> {
  try {
    const conn = await connectDB();
    if (!conn) return [];

    const docs = await FeedModel.find({}).select("slug").lean();
    return docs.map((d) => d.slug).filter(Boolean);
  } catch (error) {
    console.error("❌ getFeedSlugs error:", error);
    return [];
  }
}
