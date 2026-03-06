import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { FeedModel } from "@/lib/models/Feed";
import type { IFeed } from "@/lib/models/Feed";
import { feedUpdateSchema } from "@/lib/validate";
import {
  dbUnavailableResponse,
  validationErrorResponse,
  invalidIdResponse,
} from "@/lib/api-helpers";
import { slugify } from "@/lib/slugify";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

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
    source: doc.source ?? undefined,
    storyId: doc.storyId ?? null,
  };
}

// GET /api/feeds/[id] — returns a single feed by numeric ID
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

// PUT /api/feeds/[id] — updates an existing feed
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const feedId = Number(id);
    if (Number.isNaN(feedId)) return invalidIdResponse();

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const raw = await req.json();
    const parsed = feedUpdateSchema.safeParse(raw);
    if (!parsed.success) return validationErrorResponse(parsed.error);

    const result = await FeedModel.findOneAndUpdate(
      { id: feedId },
      { $set: parsed.data },
      { new: true, lean: true }
    );

    if (!result) {
      return NextResponse.json({ error: "Feed not found" }, { status: 404 });
    }

    // Invalidate both the data cache (unstable_cache) and the ISR page cache
    revalidateTag("feeds");
    revalidatePath("/");
    revalidatePath("/berita");
    revalidatePath("/tutorial");
    revalidatePath("/riset");
    revalidatePath(`/read/${result.slug || slugify(result.title, result.id)}`);

    return NextResponse.json(feedToJson(result));
  } catch (error) {
    console.error("PUT /api/feeds/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update feed" },
      { status: 500 }
    );
  }
}

// DELETE /api/feeds/[id] — deletes a feed
export async function DELETE(_req: NextRequest, context: RouteContext) {
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

    // Invalidate both the data cache (unstable_cache) and the ISR page cache
    revalidateTag("feeds");
    revalidatePath("/");
    revalidatePath("/berita");
    revalidatePath("/tutorial");
    revalidatePath("/riset");
    const slug =
      feedToDelete.slug || slugify(feedToDelete.title, feedToDelete.id);
    revalidatePath(`/read/${slug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/feeds/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete feed" },
      { status: 500 }
    );
  }
}
