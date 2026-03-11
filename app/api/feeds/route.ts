import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { FeedModel } from "@/lib/models/Feed";
import type { IFeed } from "@/lib/models/Feed";
import { feedCreateSchema, sanitizeSearchQuery } from "@/lib/validate";
import {
  dbUnavailableResponse,
  validationErrorResponse,
  cachedJson,
} from "@/lib/api-helpers";
import { requireAdmin } from "@/lib/api-auth";
import { slugify } from "@/lib/slugify";
import {
  INDEXNOW_KEY,
  INDEXNOW_ENGINES,
  BASE_URL,
} from "@/lib/indexnow-config";

export const dynamic = "force-dynamic";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Hitung lineCount dan previewLines dari array lines. */
function computeLineFields(lines: IFeed["lines"]) {
  return {
    lineCount: lines.filter((l) => l.role === "q").length,
    previewLines: lines.slice(0, 2),
  };
}

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
    lineCount: doc.lineCount ?? 0,
    previewLines: doc.previewLines ?? [],
    takeaway: doc.takeaway,
    author: doc.author ?? "",
    source: doc.source ?? undefined,
    storyId: doc.storyId ?? null,
  };
}

/**
 * Invalidate semua cache setelah perubahan data.
 * revalidatePath("/", "layout") cukup untuk invalidate semua halaman sekaligus.
 */
function revalidateAllFeedCaches(slug?: string) {
  revalidatePath("/", "layout");
  if (slug) revalidatePath(`/read/${slug}`, "page");
}

// ─── GET /api/feeds ───────────────────────────────────────────────────────────

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

    // Cache search results 30s, full list 60s
    return cachedJson(feeds.map(feedToJson), q ? 30 : 60);
  } catch (error) {
    console.error("GET /api/feeds error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feeds" },
      { status: 500 }
    );
  }
}

// ─── POST /api/feeds ──────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const raw = await req.json();
    const parsed = feedCreateSchema.safeParse(raw);
    if (!parsed.success) return validationErrorResponse(parsed.error);
    const body = parsed.data;

    // Auto-increment ID berdasarkan ID tertinggi yang ada
    const last = await FeedModel.findOne().sort({ id: -1 }).lean();
    const nextId = last ? last.id + 1 : 1;

    const newFeed = await FeedModel.create({
      id: nextId,
      slug: slugify(body.title, nextId),
      title: body.title,
      category: body.category,
      image: body.image,
      lines: body.lines,
      ...computeLineFields(body.lines),
      takeaway: body.takeaway,
      author: body.author ?? "",
      source: body.source,
      storyId: body.storyId,
      createdAt: Date.now(),
      popularity: 0,
    });

    // Fire-and-forget: ping search engines tanpa block response
    void pingIndexNow(newFeed.slug || slugify(newFeed.title, newFeed.id));

    revalidateAllFeedCaches();

    return NextResponse.json(feedToJson(newFeed), { status: 201 });
  } catch (error) {
    console.error("POST /api/feeds error:", error);
    return NextResponse.json(
      { error: "Failed to create feed" },
      { status: 500 }
    );
  }
}

// ─── IndexNow ─────────────────────────────────────────────────────────────────

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
