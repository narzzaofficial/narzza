import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ProductModel } from "@/lib/models/Product";
import type { IProduct } from "@/lib/models/Product";
import { productCreateSchema } from "@/lib/validate";
import { products as dummyProducts } from "@/types/products";
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

// GET /api/products — list all products
export async function GET() {
  try {
    const conn = await connectDB();
    if (!conn) return NextResponse.json(dummyProducts);

    const docs = await ProductModel.find().sort({ createdAt: -1 }).lean();
    // If DB is empty, fall back to dummy data
    if (docs.length === 0) return NextResponse.json(dummyProducts);

    return NextResponse.json(docs.map(productToJson));
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(dummyProducts);
  }
}

// POST /api/products — create new product
export async function POST(req: Request) {
  try {
    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const raw = await req.json();
    const parsed = productCreateSchema.safeParse(raw);
    if (!parsed.success) return validationErrorResponse(parsed.error);
    const body = parsed.data;

    // Prevent duplicate product IDs
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

    return NextResponse.json({ success: true, id: product.id });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
