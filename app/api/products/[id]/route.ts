import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { ProductModel } from "@/lib/models/Product";
import type { IProduct } from "@/lib/models/Product";
import { productUpdateSchema } from "@/lib/validate";
import {
  dbUnavailableResponse,
  validationErrorResponse,
} from "@/lib/api-helpers";
import { requireAdmin } from "@/lib/api-auth";

function productToJson(doc: IProduct) {
  return {
    id: doc.id,
    name: doc.name,
    description: doc.description,
    price: doc.price,
    images: doc.images,
    category: doc.category,
    categoryId: doc.categoryId,
    stock: doc.stock,
    featured: doc.featured ?? false,
    productType: doc.productType,
    platforms: doc.platforms ?? {},
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conn = await connectDB();
    if (!conn)
      return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

    const doc = await ProductModel.findOne({ id }).lean();
    if (!doc)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json(productToJson(doc));
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const { id } = await params;
    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const raw = await req.json();
    const parsed = productUpdateSchema.safeParse(raw);
    if (!parsed.success) return validationErrorResponse(parsed.error);

    const result = await ProductModel.findOneAndUpdate(
      { id },
      { $set: { ...parsed.data, updatedAt: Date.now() } },
      { returnDocument: "after", lean: true }
    );

    if (!result)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });

    revalidateTag("products", "");
    return NextResponse.json(productToJson(result));
  } catch (error) {
    console.error("PUT /api/products/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const { id } = await params;
    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const result = await ProductModel.deleteOne({ id });
    if (result.deletedCount === 0)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });

    revalidateTag("products", "");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
