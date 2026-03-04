import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ProductModel } from "@/lib/models/Product";
import type { IProduct } from "@/lib/models/Product";
import { productUpdateSchema } from "@/lib/validate";
import { getProductById as getDummyProductById } from "@/types/products";
import {
  dbUnavailableResponse,
  validationErrorResponse,
} from "@/lib/api-helpers";

/** Shapes a Mongoose Product document into the JSON response format. */
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

// GET /api/products/[id] — returns a single product by string ID
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conn = await connectDB();

    if (!conn) {
      // DB not available — fall back to in-memory dummy data
      const product = getDummyProductById(id);
      if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
      return NextResponse.json(product);
    }

    const doc = await ProductModel.findOne({ id }).lean();
    if (!doc) {
      // Not in DB — try dummy data as last resort
      const fallback = getDummyProductById(id);
      if (!fallback) return NextResponse.json({ error: "Product not found" }, { status: 404 });
      return NextResponse.json(fallback);
    }

    return NextResponse.json(productToJson(doc));
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// PUT /api/products/[id] — updates an existing product (all fields optional)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const raw = await req.json();
    const parsed = productUpdateSchema.safeParse(raw);
    if (!parsed.success) return validationErrorResponse(parsed.error);

    // Merge validated fields with an auto-updated timestamp
    const result = await ProductModel.findOneAndUpdate(
      { id },
      { $set: { ...parsed.data, updatedAt: Date.now() } },
      { new: true, lean: true }
    );

    if (!result) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(productToJson(result));
  } catch (error) {
    console.error("PUT /api/products/[id] error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE /api/products/[id] — deletes a product
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const result = await ProductModel.deleteOne({ id });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

