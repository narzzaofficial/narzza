import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { CommentModel } from "@/lib/models/Comment";
import { FeedModel } from "@/lib/models/Feed";
import { rateLimit } from "@/lib/rate-limit";
import { commentCreateSchema } from "@/lib/validate";

export const dynamic = "force-dynamic";

const FEED_ID_QUERY_SCHEMA = z.coerce.number().int().positive();

/** Max 15 komentar per IP per menit — kurangi spam DB */
const COMMENTS_RATE_LIMIT = { max: 15, windowMs: 60_000 };

/** GET /api/comments?feedId=123 — list komentar untuk satu artikel */
export async function GET(request: NextRequest) {
  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json(
        { error: "Database tidak tersedia" },
        { status: 503 }
      );
    }

    const feedIdRaw = request.nextUrl.searchParams.get("feedId");
    const parsed = FEED_ID_QUERY_SCHEMA.safeParse(feedIdRaw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "feedId wajib dan harus angka positif" },
        { status: 400 }
      );
    }
    const feedId = parsed.data;

    const docs = await CommentModel.find({ feedId })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    const comments = docs.map((d) => ({
      id: d._id.toString(),
      feedId: d.feedId,
      author: d.author,
      text: d.text,
      createdAt: d.createdAt,
    }));

    return NextResponse.json(comments);
  } catch (error) {
    console.error("GET /api/comments error:", error);
    return NextResponse.json(
      { error: "Gagal memuat komentar" },
      { status: 500 }
    );
  }
}

/** POST /api/comments — tambah komentar (validasi + sanitasi) */
export async function POST(request: NextRequest) {
  const rateLimitRes = rateLimit(request, "comments", COMMENTS_RATE_LIMIT);
  if (rateLimitRes) return rateLimitRes;

  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json(
        { error: "Database tidak tersedia" },
        { status: 503 }
      );
    }

    const raw = await request.json();
    const parsed = commentCreateSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Data tidak valid", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { feedId, author, text } = parsed.data;

    const feedExists = await FeedModel.findOne({ id: feedId }, { _id: 1 }).lean();
    if (!feedExists) {
      return NextResponse.json(
        { error: "Artikel tidak ditemukan" },
        { status: 404 }
      );
    }

    const doc = await CommentModel.create({
      feedId,
      author,
      text,
      createdAt: Date.now(),
    });

    return NextResponse.json(
      {
        id: doc._id.toString(),
        feedId: doc.feedId,
        author: doc.author,
        text: doc.text,
        createdAt: doc.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/comments error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan komentar" },
      { status: 500 }
    );
  }
}
