import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { BookModel } from "@/lib/models/Book";
import type { IBook } from "@/lib/models/Book";
import { bookSchema } from "@/lib/validate";
import {
  dbUnavailableResponse,
  validationErrorResponse,
  invalidIdResponse,
} from "@/lib/api-helpers";
import { requireAdmin } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

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

// GET /api/books/[id] — returns a single book by numeric ID
export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const bookId = Number(id);
    if (Number.isNaN(bookId)) return invalidIdResponse();

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const doc = await BookModel.findOne({ id: bookId }).lean();
    if (!doc) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json(bookToJson(doc));
  } catch (error) {
    console.error("GET /api/books/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch book" },
      { status: 500 }
    );
  }
}

// PUT /api/books/[id] — updates an existing book (all fields optional)
export async function PUT(request: NextRequest, context: RouteContext) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const { id } = await context.params;
    const bookId = Number(id);
    if (Number.isNaN(bookId)) return invalidIdResponse();

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const raw = await request.json();
    const parsed = bookSchema.partial().safeParse(raw);
    if (!parsed.success) return validationErrorResponse(parsed.error);

    // Use parsed.data directly — only the provided fields will be updated
    const result = await BookModel.findOneAndUpdate(
      { id: bookId },
      { $set: parsed.data },
      { new: true, lean: true }
    );

    if (!result) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    revalidateTag("books", {});
    return NextResponse.json(bookToJson(result));
  } catch (error) {
    console.error("PUT /api/books/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 }
    );
  }
}

// DELETE /api/books/[id] — deletes a book
export async function DELETE(_request: NextRequest, context: RouteContext) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const { id } = await context.params;
    const bookId = Number(id);
    if (Number.isNaN(bookId)) return invalidIdResponse();

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const result = await BookModel.deleteOne({ id: bookId });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    revalidateTag("books", {});
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/books/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    );
  }
}
