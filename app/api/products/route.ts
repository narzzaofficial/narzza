import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { ProductModel } from "@/lib/models/Product";
import type { IProduct } from "@/lib/models/Product";
import { productCreateSchema } from "@/lib/validate";
import {
  dbUnavailableResponse,
  validationErrorResponse,
} from "@/lib/api-helpers";

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

export async function GET() {
  try {
    const conn = await connectDB();
    if (!conn) return NextResponse.json([]);

    const docs = await ProductModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(docs.map(productToJson));
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const raw = await req.json();
    const parsed = productCreateSchema.safeParse(raw);
    if (!parsed.success) return validationErrorResponse(parsed.error);
    const body = parsed.data;

    const existing = await ProductModel.findOne({ id: body.id }).lean();
    if (existing) {
      return NextResponse.json(
        { error: "Product ID already exists" },
        { status: 409 }
      );
    }

    const now = Date.now();
    const product = await ProductModel.create({
      ...body,
      images: body.images.filter(Boolean),
      categoryId: body.categoryId ?? body.category,
      platforms: body.platforms ?? {},
      createdAt: now,
      updatedAt: now,
    });

    revalidateTag("products", "");
    return NextResponse.json({ success: true, id: product.id });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
