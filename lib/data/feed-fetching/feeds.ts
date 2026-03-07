import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { FeedModel } from "@/lib/models/Feed";
import type { IFeed } from "@/lib/models/Feed";
import type { Feed } from "@/types/content";
import { feeds as dummyFeeds } from "@/constants/content";
import { CONTENT_REVALIDATE_SECONDS, CACHE_TAGS } from "../constants";
import { slugify, parseSlugId } from "@/lib/slugify";

/**
 * Ensure a feed from in-memory/dummy data has a slug.
 * (Feeds from MongoDB always have a slug, but dummy data may not.)
 */
function ensureSlug(feed: Feed): Feed {
  return feed.slug ? feed : { ...feed, slug: slugify(feed.title, feed.id) };
}

/**
 * Convert a raw Mongoose Feed document into a plain Feed object.
 * Shared by loadFeeds() and loadFeedById() to avoid repeating the field mapping.
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
    takeaway: d.takeaway ?? "",
    author: d.author ?? "",
    source: d.source as Feed["source"],
    storyId: d.storyId ?? null,
  };
}
async function loadFeeds(category?: Feed["category"]): Promise<Feed[]> {
  try {
    const conn = await connectDB();
    if (!conn) return [];

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;

    const docs = await FeedModel.find(filter)
      // Hapus '-takeaway' dari sini. Kita butuh takeaway untuk "Inti Cepat".
      // Kita cuma buang '-lines' (isi chat yang berat).
      .select("-lines")
      .sort({ createdAt: -1 })
      .lean();

    return docs.map(docToFeed);
  } catch (error) {
    console.error("DB Error:", error);
    return [];
  }
}

async function loadFeedById(id: number): Promise<Feed | null> {
  try {
    const conn = await connectDB();
    if (!conn) return null;
    const doc = await FeedModel.findOne({ id }).lean();
    return doc ? docToFeed(doc) : null;
  } catch (error) {
    console.error("DB Error:", error);
    return null;
  }
}

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

export async function getFeedBySlug(slug: string): Promise<Feed | null> {
  try {
    const conn = await connectDB();
    if (!conn) return null; // Biarkan dia mencoba ambil dari cache/dummy di level atas

    // Langsung cari satu dokumen saja di MongoDB berdasarkan slug
    const doc = await FeedModel.findOne({ slug }).lean();
    if (doc) return docToFeed(doc);

    // Jika slug tidak ketemu, coba cari berdasarkan ID (seperti logika lamamu)
    const id = parseSlugId(slug);
    if (id !== null) {
      const docById = await FeedModel.findOne({ id }).lean();
      return docById ? docToFeed(docById) : null;
    }

    return null;
  } catch (error) {
    console.error("Error fetching slug:", error);
    return null;
  }
}

export async function getFeedSlugs(): Promise<string[]> {
  try {
    const conn = await connectDB();
    if (!conn) return []; // Jangan lari ke dummy data di sini agar build tidak salah

    // Hanya ambil field 'slug', abaikan yang lain. Sangat cepat!
    const docs = await FeedModel.find({}).select("slug").lean();
    return docs.map((d) => d.slug).filter(Boolean);
  } catch (error) {
    console.error("Error fetching slugs:", error);
    return [];
  }
}
