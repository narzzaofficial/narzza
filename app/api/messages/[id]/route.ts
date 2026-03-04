import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { dbUnavailableResponse } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

// PATCH /api/messages/:id — update status
export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const db = await getDb();
    if (!db) return dbUnavailableResponse();

    const allowed = ["unread", "read", "archived"];
    if (body.status && !allowed.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const result = await db
      .collection("messages")
      .findOneAndUpdate(
        { id },
        { $set: { status: body.status } },
        { returnDocument: "after" }
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
    const db = await getDb();
    if (!db) return dbUnavailableResponse();

    const result = await db.collection("messages").deleteOne({ id });
    if (result.deletedCount === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/messages/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

