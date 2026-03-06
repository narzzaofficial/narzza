import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { BookModel } from "@/lib/models/Book";
import type { IBook } from "@/lib/models/Book";
import { bookSchema, sanitizeSearchQuery } from "@/lib/validate";
import {
  dbUnavailableResponse,
  validationErrorResponse,
  cachedJson,
} from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

/** Shapes a Mongoose Book document into the JSON response format. */
function bookToJson(doc: IBook) {
  return {
    id: doc.id,
    title: doc.title,
    author: doc.author,
    cover: doc.cover,
    genre: doc.genre,
    pages: doc.pages,
    rating: doc.rating,
    description: doc.description,
    chapters: doc.chapters,
    storyId: doc.storyId ?? null,
  };
}

// GET /api/books — list all books, optional ?q= search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const q = sanitizeSearchQuery(searchParams.get("q"));

    const filter: Record<string, unknown> = {};
    if (q) filter.title = { $regex: q, $options: "i" };

    const books = await BookModel.find(filter).sort({ id: 1 }).lean();
    return cachedJson(books.map(bookToJson), q ? 30 : 60);
  } catch (error) {
    console.error("GET /api/books error:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}

// POST /api/books — create a new book
export async function POST(request: NextRequest) {
  try {
    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const raw = await request.json();
    const parsed = bookSchema.safeParse(raw);
    if (!parsed.success) return validationErrorResponse(parsed.error);
    const body = parsed.data;

    // Auto-increment numeric ID based on the highest existing ID
    const last = await BookModel.findOne().sort({ id: -1 }).lean();
    const newId = last ? last.id + 1 : 1;

    const newBook = await BookModel.create({ id: newId, ...body });
    revalidateTag("books", {});
    return NextResponse.json(bookToJson(newBook), { status: 201 });
  } catch (error) {
    console.error("POST /api/books error:", error);
    return NextResponse.json(
      { error: "Failed to create book" },
      { status: 500 }
    );
  }
}
