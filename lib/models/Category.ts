import mongoose, { Schema, model, models } from "mongoose";

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  createdAt?: number;
  updatedAt?: number;
}

const CategorySchema = new Schema<ICategory>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "" },
    createdAt: { type: Number, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() },
  },
  { versionKey: false }
);

export const CategoryModel =
  (models.Category as mongoose.Model<ICategory>) || model<ICategory>("Category", CategorySchema);
