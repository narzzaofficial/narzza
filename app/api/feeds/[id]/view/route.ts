import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FeedModel } from "@/lib/models/Feed";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/feeds/[id]/view — increment popularity untuk artikel yang dibuka.
 * Dipanggil dari client (useEffect) saat halaman /read/[slug] dimuat.
 * Tidak butuh auth — action public yang safe karena hanya increment counter.
 */
export async function POST(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const feedId = Number(id);
    if (Number.isNaN(feedId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: "DB unavailable" }, { status: 503 });
    }

    const result = await FeedModel.findOneAndUpdate(
      { id: feedId },
      { $inc: { popularity: 1 } },
      { new: true, lean: true, select: "id popularity" }
    );

    if (!result) {
      return NextResponse.json({ error: "Feed not found" }, { status: 404 });
    }

    return NextResponse.json({ id: result.id, popularity: result.popularity });
  } catch (error) {
    console.error("POST /api/feeds/[id]/view error:", error);
    return NextResponse.json({ error: "Failed to track view" }, { status: 500 });
  }
}
