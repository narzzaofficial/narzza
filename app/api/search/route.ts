import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FeedModel } from "@/lib/models/Feed";
import { BookModel } from "@/lib/models/Book";
import { RoadmapModel } from "@/lib/models/Roadmap";
import { sanitizeSearchQuery } from "@/lib/validate";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const MAX_RESULTS = 5;
/** Max 30 search requests per IP per minute — $text search berat di MongoDB */
const SEARCH_RATE_LIMIT = { max: 30, windowMs: 60_000 };

export async function GET(request: NextRequest) {
  const rateLimitRes = rateLimit(request, "search", SEARCH_RATE_LIMIT);
  if (rateLimitRes) return rateLimitRes;

  const q = sanitizeSearchQuery(request.nextUrl.searchParams.get("q"));

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ feeds: [], books: [], roadmaps: [] });
  }

  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ feeds: [], books: [], roadmaps: [] });
    }

    const textFilter = { $text: { $search: q.trim() } };
    const textScore = { score: { $meta: "textScore" } };

    const [feeds, books, roadmaps] = await Promise.all([
      FeedModel.find(textFilter, { ...textScore, lines: 0 })
        .sort({ score: { $meta: "textScore" }, popularity: -1 })
        .limit(MAX_RESULTS)
        .lean(),

      BookModel.find(textFilter, { ...textScore, "chapters.lines": 0 })
        .sort({ score: { $meta: "textScore" } })
        .limit(MAX_RESULTS)
        .lean(),

      RoadmapModel.find(textFilter, { ...textScore, steps: 0 })
        .sort({ score: { $meta: "textScore" } })
        .limit(MAX_RESULTS)
        .lean(),
    ]);

    return NextResponse.json(
      { feeds, books, roadmaps },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("GET /api/search error:", error);
    return NextResponse.json(
      { feeds: [], books: [], roadmaps: [] },
      { status: 500 }
    );
  }
}
