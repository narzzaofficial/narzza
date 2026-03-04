import mongoose, { Schema, model, models } from "mongoose";

export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  categoryId?: string;
  stock: number;
  featured?: boolean;
  productType: "physical" | "digital";
  platforms?: {
    shopee?: string;
    tokopedia?: string;
    tiktokshop?: string;
    lynk?: string;
  };
  createdAt?: number;
  updatedAt?: number;
}

const PlatformSchema = new Schema(
  {
    shopee: { type: String },
    tokopedia: { type: String },
    tiktokshop: { type: String },
    lynk: { type: String },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    images: { type: [String], default: [] },
    category: { type: String, required: true },
    categoryId: { type: String },
    stock: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    productType: { type: String, enum: ["physical", "digital"], required: true },
    platforms: { type: PlatformSchema },
    createdAt: { type: Number, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() },
  },
  { versionKey: false }
);

export const ProductModel =
  (models.Product as mongoose.Model<IProduct>) || model<IProduct>("Product", ProductSchema);
