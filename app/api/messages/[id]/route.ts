import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { MessageModel } from "@/lib/models/Message";
import { dbUnavailableResponse } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

// PATCH /api/messages/:id — update status
export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const allowed = ["unread", "read", "archived"];
    if (body.status && !allowed.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const result = await MessageModel.findOneAndUpdate(
      { id },
      { $set: { status: body.status } },
      { new: true, lean: true }
    );

    if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...msg } = result;
    return NextResponse.json(msg);
  } catch (err) {
    console.error("PATCH /api/messages/[id] error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// DELETE /api/messages/:id
export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const result = await MessageModel.deleteOne({ id });
    if (result.deletedCount === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/messages/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

