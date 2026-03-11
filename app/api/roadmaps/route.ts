import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { RoadmapModel } from "@/lib/models/Roadmap";
import type { IRoadmap } from "@/lib/models/Roadmap";
import { dbUnavailableResponse, cachedJson } from "@/lib/api-helpers";
import { requireAdmin } from "@/lib/api-auth";
import { slugifyBase } from "@/lib/slugify";
import { sanitizeSearchQuery } from "@/lib/validate";

export const dynamic = "force-dynamic";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeTags(tags: unknown): string[] {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string")
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  return [];
}

function roadmapToJson(doc: IRoadmap) {
  return {
    slug: doc.slug,
    title: doc.title,
    summary: doc.summary ?? "",
    duration: doc.duration ?? "",
    level: doc.level ?? "Pemula",
    tags: doc.tags ?? [],
    image: doc.image ?? "",
    steps: doc.steps ?? [],
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function revalidateRoadmapCaches() {
  revalidatePath("/", "layout");
}

// ─── GET /api/roadmaps ────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const q = sanitizeSearchQuery(request.nextUrl.searchParams.get("q"));

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const filter: Record<string, unknown> = {};
    if (q) filter.title = { $regex: q, $options: "i" };

    // Kalau search, exclude steps yang berat
    const docs = await RoadmapModel.find(filter, q ? { steps: 0 } : {})
      .sort({ createdAt: -1 })
      .lean();

    return cachedJson(docs.map(roadmapToJson), q ? 30 : 60);
  } catch (error) {
    console.error("GET /api/roadmaps error:", error);
    return NextResponse.json(
      { error: "Failed to fetch roadmaps" },
      { status: 500 }
    );
  }
}

// ─── POST /api/roadmaps ───────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;
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

    revalidateRoadmapCaches();
    return NextResponse.json(roadmapToJson(doc), { status: 201 });
  } catch (error) {
    console.error("POST /api/roadmaps error:", error);
    return NextResponse.json(
      { error: "Failed to create roadmap" },
      { status: 500 }
    );
  }
}
