import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { StoryModel } from "@/lib/models/Story";
import { storyCreateSchema } from "@/lib/validate";
import { stories as dummyStories } from "@/data/content";
import {
  dbUnavailableResponse,
  validationErrorResponse,
} from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

// GET all stories
export async function GET() {
  try {
    const conn = await connectDB();

    if (!conn) {
      console.warn("MongoDB not available, using dummy data");
      return NextResponse.json(dummyStories);
    }

    const stories = await StoryModel.find().sort({ id: 1 }).lean();

    const mapped = stories.map((s) => ({
      id: s.id,
      name: s.name,
      label: s.label,
      type: s.type,
      palette: s.palette,
      image: s.image || "",
      viral: s.viral,
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("GET /api/stories error:", error);
    return NextResponse.json(dummyStories, { status: 200 });
  }
}

// POST create story
export async function POST(req: NextRequest) {
  try {
    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();
    const raw = await req.json();
    const parsed = storyCreateSchema.safeParse(raw);
    if (!parsed.success) return validationErrorResponse(parsed.error);
    const body = parsed.data;

    const last = await StoryModel.findOne().sort({ id: -1 }).lean();
    const nextId = last ? last.id + 1 : 1;

    const newStory = await StoryModel.create({
      name: body.name,
      label: body.label,
      type: body.type,
      palette: body.palette,
      image: body.image || "",
      viral: body.viral,
      id: nextId,
    });

    return NextResponse.json(
      { id: newStory.id, name: newStory.name, label: newStory.label, type: newStory.type, palette: newStory.palette, image: newStory.image, viral: newStory.viral },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/stories error:", error);
    return NextResponse.json(
      { error: "Failed to create story" },
      { status: 500 }
    );
  }
}
