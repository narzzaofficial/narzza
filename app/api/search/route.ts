import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FeedModel } from "@/lib/models/Feed";
import { BookModel } from "@/lib/models/Book";
import { RoadmapModel } from "@/lib/models/Roadmap";
import { sanitizeSearchQuery } from "@/lib/validate";

export const dynamic = "force-dynamic";

const MAX_RESULTS = 5;

export async function GET(request: NextRequest) {
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
