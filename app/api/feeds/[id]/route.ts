import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { FeedModel } from "@/lib/models/Feed";
import type { IFeed } from "@/lib/models/Feed";
import { feedUpdateSchema } from "@/lib/validate";
import {
  dbUnavailableResponse,
  validationErrorResponse,
  invalidIdResponse,
} from "@/lib/api-helpers";
import { requireAdmin } from "@/lib/api-auth";
import { slugify } from "@/lib/slugify";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

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

// ─── GET /api/feeds/[id] ──────────────────────────────────────────────────────

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const feedId = Number(id);
    if (Number.isNaN(feedId)) return invalidIdResponse();

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const feed = await FeedModel.findOne({ id: feedId }).lean();
    if (!feed) {
      return NextResponse.json({ error: "Feed not found" }, { status: 404 });
    }

    return NextResponse.json(feedToJson(feed));
  } catch (error) {
    console.error("GET /api/feeds/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feed" },
      { status: 500 }
    );
  }
}

// ─── PUT /api/feeds/[id] ──────────────────────────────────────────────────────

export async function PUT(req: NextRequest, context: RouteContext) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const { id } = await context.params;
    const feedId = Number(id);
    if (Number.isNaN(feedId)) return invalidIdResponse();

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const raw = await req.json();
    const parsed = feedUpdateSchema.safeParse(raw);
    if (!parsed.success) return validationErrorResponse(parsed.error);

    const updateData = {
      ...parsed.data,
      // Kalau lines diupdate, hitung ulang lineCount dan previewLines otomatis
      ...(parsed.data.lines ? computeLineFields(parsed.data.lines) : {}),
    };

    const result = await FeedModel.findOneAndUpdate(
      { id: feedId },
      { $set: updateData },
      { new: true, lean: true }
    );

    if (!result) {
      return NextResponse.json({ error: "Feed not found" }, { status: 404 });
    }

    const slug = result.slug || slugify(result.title, result.id);
    revalidateAllFeedCaches(slug);

    return NextResponse.json(feedToJson(result));
  } catch (error) {
    console.error("PUT /api/feeds/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update feed" },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/feeds/[id] ───────────────────────────────────────────────────

export async function DELETE(_req: NextRequest, context: RouteContext) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const { id } = await context.params;
    const feedId = Number(id);
    if (Number.isNaN(feedId)) return invalidIdResponse();

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const feedToDelete = await FeedModel.findOne({ id: feedId }).lean();
    if (!feedToDelete) {
      return NextResponse.json({ error: "Feed not found" }, { status: 404 });
    }

    await FeedModel.deleteOne({ id: feedId });

    const slug =
      feedToDelete.slug || slugify(feedToDelete.title, feedToDelete.id);
    revalidateAllFeedCaches(slug);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/feeds/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete feed" },
      { status: 500 }
    );
  }
}
