import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { RoadmapModel } from "@/lib/models/Roadmap";
import type { IRoadmap } from "@/lib/models/Roadmap";
import { dbUnavailableResponse } from "@/lib/api-helpers";
import { requireAdmin } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ slug: string }> };

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

function revalidateRoadmapCaches(slug: string) {
  revalidatePath("/", "layout");
  revalidatePath(`/roadmap/${slug}`, "page");
}

// ─── GET /api/roadmaps/[slug] ─────────────────────────────────────────────────

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const doc = await RoadmapModel.findOne({ slug }).lean();
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(roadmapToJson(doc));
  } catch (error) {
    console.error("GET /api/roadmaps/[slug] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch roadmap" },
      { status: 500 }
    );
  }
}

// ─── PUT /api/roadmaps/[slug] ─────────────────────────────────────────────────

export async function PUT(request: NextRequest, context: RouteContext) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const { slug } = await context.params;
    const body = await request.json();
    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const result = await RoadmapModel.findOneAndUpdate(
      { slug },
      {
        $set: {
          title: body.title ?? "",
          summary: body.summary ?? "",
          duration: body.duration ?? "",
          level: body.level ?? "Pemula",
          tags: normalizeTags(body.tags),
          image: body.image ?? "",
          steps: Array.isArray(body.steps) ? body.steps : [],
          updatedAt: Date.now(),
        },
      },
      { returnDocument: "after", lean: true }
    );

    if (!result)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    revalidateRoadmapCaches(slug);
    return NextResponse.json(roadmapToJson(result));
  } catch (error) {
    console.error("PUT /api/roadmaps/[slug] error:", error);
    return NextResponse.json(
      { error: "Failed to update roadmap" },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/roadmaps/[slug] ──────────────────────────────────────────────

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const { slug } = await context.params;
    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const result = await RoadmapModel.deleteOne({ slug });
    if (result.deletedCount === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    revalidateRoadmapCaches(slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/roadmaps/[slug] error:", error);
    return NextResponse.json(
      { error: "Failed to delete roadmap" },
      { status: 500 }
    );
  }
}
