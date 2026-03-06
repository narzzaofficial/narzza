import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { RoadmapModel } from "@/lib/models/Roadmap";
import { roadmaps as seedRoadmaps } from "@/types/roadmaps";
import { dbUnavailableResponse, cachedJson } from "@/lib/api-helpers";
import { slugifyBase } from "@/lib/slugify";
import { sanitizeSearchQuery } from "@/lib/validate";

export const dynamic = "force-dynamic";

function normalizeTags(tags: unknown): string[] {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string")
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  return [];
}

// Lean projection for search results — omits heavy `steps` array
const SEARCH_PROJECTION = { _id: 0, steps: 0 };

// GET /api/roadmaps — list roadmaps, optional ?q= search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const q = sanitizeSearchQuery(searchParams.get("q"));

    const conn = await connectDB();
    if (!conn) {
      const results = q
        ? seedRoadmaps.filter((r) =>
            r.title.toLowerCase().includes(q.toLowerCase())
          )
        : seedRoadmaps;
      if (q) return NextResponse.json(results.map(({ steps: _s, ...r }) => r));
      return NextResponse.json(results);
    }

    const filter: Record<string, unknown> = {};
    if (q) filter.title = { $regex: q, $options: "i" };

    const projection = q ? SEARCH_PROJECTION : {};
    const docs = await RoadmapModel.find(filter, projection)
      .sort({ createdAt: -1 })
      .lean();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const roadmaps = docs.map(({ _id, ...rest }) => rest);
    return cachedJson(roadmaps, q ? 30 : 60);
  } catch (error) {
    console.error("GET /api/roadmaps error:", error);
    return NextResponse.json(seedRoadmaps, { status: 200 });
  }
}

// POST /api/roadmaps — create
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const slug = body.slug?.trim() || slugifyBase(body.title ?? "");
    if (!slug)
      return NextResponse.json(
        { error: "Slug or title required" },
        { status: 400 }
      );

    const exists = await RoadmapModel.findOne({ slug }).lean();
    if (exists)
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 }
      );

    const now = Date.now();
    const doc = await RoadmapModel.create({
      slug,
      title: body.title ?? "",
      summary: body.summary ?? "",
      duration: body.duration ?? "",
      level: body.level ?? "Pemula",
      tags: normalizeTags(body.tags),
      image: body.image ?? "",
      steps: Array.isArray(body.steps) ? body.steps : [],
      createdAt: now,
      updatedAt: now,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...result } = doc.toObject();
    revalidateTag("roadmaps", {});
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("POST /api/roadmaps error:", error);
    return NextResponse.json(
      { error: "Failed to create roadmap" },
      { status: 500 }
    );
  }
}
