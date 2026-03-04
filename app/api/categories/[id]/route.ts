import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { CategoryModel } from "@/lib/models/Category";
import { categorySchema } from "@/lib/validate";
import {
  dbUnavailableResponse,
  validationErrorResponse,
} from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const category = await CategoryModel.findOne({ id }).lean();
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...rest } = category;
    return NextResponse.json(rest);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const raw = await request.json();
    const parsed = categorySchema.partial().safeParse(raw);
    if (!parsed.success) return validationErrorResponse(parsed.error);
    const body = parsed.data;
    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const update: Record<string, unknown> = { updatedAt: Date.now() };
    if (body.name !== undefined) update.name = body.name;
    if (body.slug !== undefined) update.slug = body.slug;
    if (body.description !== undefined) update.description = body.description;
    if (body.icon !== undefined) update.icon = body.icon;

    const updated = await CategoryModel.findOneAndUpdate(
      { id },
      { $set: update },
      { new: true, lean: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...rest } = updated;
    return NextResponse.json(rest);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const result = await CategoryModel.deleteOne({ id });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
