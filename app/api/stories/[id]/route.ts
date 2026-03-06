import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { StoryModel } from "@/lib/models/Story";
import { dbUnavailableResponse, invalidIdResponse } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET single story
export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const storyId = Number(id);
    if (Number.isNaN(storyId)) return invalidIdResponse();

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const story = await StoryModel.findOne({ id: storyId }).lean();
    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: story.id,
      name: story.name,
      label: story.label,
      type: story.type,
      palette: story.palette,
      image: story.image || "",
      viral: story.viral,
    });
  } catch (error) {
    console.error("GET /api/stories/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch story" },
      { status: 500 }
    );
  }
}

// PUT update story
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const storyId = Number(id);
    if (Number.isNaN(storyId)) return invalidIdResponse();

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const body = await req.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _removedId, ...updateData } = body;

    const result = await StoryModel.findOneAndUpdate(
      { id: storyId },
      { $set: updateData },
      { new: true, lean: true }
    );

    if (!result) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    revalidateTag("stories", {});
    return NextResponse.json({
      id: result.id,
      name: result.name,
      label: result.label,
      type: result.type,
      palette: result.palette,
      image: result.image || "",
      viral: result.viral,
    });
  } catch (error) {
    console.error("PUT /api/stories/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update story" },
      { status: 500 }
    );
  }
}

// DELETE story
export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const storyId = Number(id);
    if (Number.isNaN(storyId)) return invalidIdResponse();

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const result = await StoryModel.deleteOne({ id: storyId });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    revalidateTag("stories", {});
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/stories/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete story" },
      { status: 500 }
    );
  }
}
