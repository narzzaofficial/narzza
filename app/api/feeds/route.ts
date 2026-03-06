import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { FeedModel } from "@/lib/models/Feed";
import type { IFeed } from "@/lib/models/Feed";
import { feedCreateSchema, sanitizeSearchQuery } from "@/lib/validate";
import {
  dbUnavailableResponse,
  validationErrorResponse,
  cachedJson,
} from "@/lib/api-helpers";
import { slugify } from "@/lib/slugify";
import {
  INDEXNOW_KEY,
  INDEXNOW_ENGINES,
  BASE_URL,
} from "@/lib/indexnow-config";

export const dynamic = "force-dynamic";

/** Shapes a Mongoose Feed document into the JSON response format. */
function feedToJson(doc: IFeed) {
  return {
    id: doc.id,
    slug: doc.slug || slugify(doc.title, doc.id),
    title: doc.title,
    category: doc.category,
    createdAt: doc.createdAt ?? Date.now(),
    popularity: doc.popularity,
    image: doc.image,
    lines: doc.lines,
    takeaway: doc.takeaway,
    author: doc.author ?? "",
    source: doc.source ?? undefined,
    storyId: doc.storyId ?? null,
  };
}

// GET /api/feeds — returns all feeds, optionally filtered by ?category=... or ?q=...
export async function GET(req: NextRequest) {
  try {
    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const category = req.nextUrl.searchParams.get("category");
    const q = sanitizeSearchQuery(req.nextUrl.searchParams.get("q"));

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (q) filter.title = { $regex: q, $options: "i" };

    const feeds = await FeedModel.find(filter).sort({ createdAt: -1 }).lean();
    // Cache search results 30s, full list 60s on Vercel CDN
    return cachedJson(feeds.map(feedToJson), q ? 30 : 60);
  } catch (error) {
    console.error("GET /api/feeds error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feeds" },
      { status: 500 }
    );
  }
}

// POST /api/feeds — creates a new feed
export async function POST(req: NextRequest) {
  try {
    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const raw = await req.json();
    const parsed = feedCreateSchema.safeParse(raw);
    if (!parsed.success) return validationErrorResponse(parsed.error);
    const body = parsed.data;

    // Auto-increment numeric ID based on the highest existing ID
    const last = await FeedModel.findOne().sort({ id: -1 }).lean();
    const nextId = last ? last.id + 1 : 1;

    const newFeed = await FeedModel.create({
      id: nextId,
      slug: slugify(body.title, nextId),
      title: body.title,
      category: body.category,
      image: body.image,
      lines: body.lines,
      takeaway: body.takeaway,
      author: body.author ?? "",
      source: body.source,
      storyId: body.storyId,
      createdAt: Date.now(),
      popularity: 0,
    });

    // Fire-and-forget: notify search engines without blocking the response
    void pingIndexNow(newFeed.slug || slugify(newFeed.title, newFeed.id));

    // Invalidate both the data cache (unstable_cache) and the ISR page cache
    revalidateTag("feeds", {});
    revalidatePath("/");
    revalidatePath("/berita");
    revalidatePath("/tutorial");
    revalidatePath("/riset");

    return NextResponse.json(feedToJson(newFeed), { status: 201 });
  } catch (error) {
    console.error("POST /api/feeds error:", error);
    return NextResponse.json(
      { error: "Failed to create feed" },
      { status: 500 }
    );
  }
}

/**
 * Fires-and-forgets an IndexNow ping to all configured engines.
 * Called after a feed is successfully created.
 */
async function pingIndexNow(slug: string): Promise<void> {
  const articleUrl = `${BASE_URL}/read/${slug}`;
  const payload = {
    host: new URL(BASE_URL).hostname,
    key: INDEXNOW_KEY,
    keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: [articleUrl],
  };
  await Promise.allSettled(
    INDEXNOW_ENGINES.map((endpoint) =>
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
      })
    )
  );
}
