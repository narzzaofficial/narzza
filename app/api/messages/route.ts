import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { dbUnavailableResponse } from "@/lib/api-helpers";
import type { Message, MessageCreatePayload } from "@/types/messages";

export const dynamic = "force-dynamic";

// GET /api/messages — list all (admin only)
export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    if (!db) return dbUnavailableResponse();

    const status = req.nextUrl.searchParams.get("status");
    const type = req.nextUrl.searchParams.get("type");

    const filter: Record<string, string> = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const docs = await db
      .collection("messages")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      docs.map(({ _id, ...rest }) => rest)
    );
  } catch (err) {
    console.error("GET /api/messages error:", err);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

// POST /api/messages — create (public, from floating form)
export async function POST(req: NextRequest) {
  try {
    const body: MessageCreatePayload = await req.json();

    if (!body.message?.trim()) {
      return NextResponse.json({ error: "Pesan tidak boleh kosong" }, { status: 400 });
    }
    if (!["bug", "suggestion"].includes(body.type)) {
      return NextResponse.json({ error: "Tipe tidak valid" }, { status: 400 });
    }

    const db = await getDb();
    if (!db) return dbUnavailableResponse();

    const doc: Omit<Message, "_id"> = {
      id: crypto.randomUUID(),
      type: body.type,
      status: "unread",
      name: body.name?.trim() || "Anonim",
      email: body.email?.trim() || "",
      message: body.message.trim(),
      pageUrl: body.pageUrl || "",
      contentType: body.contentType,
      title: body.title?.trim() || "",
      createdAt: Date.now(),
    };

    await db.collection("messages").insertOne(doc as never);
    return NextResponse.json(doc, { status: 201 });
  } catch (err) {
    console.error("POST /api/messages error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

