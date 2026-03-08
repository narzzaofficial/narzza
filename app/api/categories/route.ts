import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { CategoryModel } from "@/lib/models/Category";
import { categorySchema } from "@/lib/validate";
import {
  dbUnavailableResponse,
  validationErrorResponse,
} from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const conn = await connectDB();
    if (!conn) return NextResponse.json([]);

    const data = await CategoryModel.find().sort({ name: 1 }).lean();
    const formattedData = data.map(({ _id, ...rest }) => rest);
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const raw = await request.json();
    const parsed = categorySchema.safeParse(raw);
    if (!parsed.success) return validationErrorResponse(parsed.error);
    const body = parsed.data;
    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const now = Date.now();
    const slugBase =
      body.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") || "category";

    const newCategory = await CategoryModel.create({
      id: body.id ?? body.slug ?? slugBase,
      name: body.name,
      slug: body.slug ?? slugBase,
      description: body.description ?? "",
      icon: body.icon ?? "",
      createdAt: now,
      updatedAt: now,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...result } = newCategory.toObject();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
