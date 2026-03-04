import mongoose, { Schema, model, models } from "mongoose";

export interface IMessage {
  id: string;
  type: "bug" | "suggestion";
  status: "unread" | "read" | "archived";
  name: string;
  email: string;
  message: string;
  pageUrl?: string;
  contentType?: "Artikel" | "Tutorial" | "Riset" | "Buku" | "Roadmap" | "Produk" | "Lainnya";
  title?: string;
  createdAt: number;
}

const MessageSchema = new Schema<IMessage>(
  {
    id: { type: String, required: true, unique: true },
    type: { type: String, enum: ["bug", "suggestion"], required: true },
    status: { type: String, enum: ["unread", "read", "archived"], default: "unread" },
    name: { type: String, default: "Anonim" },
    email: { type: String, default: "" },
    message: { type: String, required: true },
    pageUrl: { type: String, default: "" },
    contentType: {
      type: String,
      enum: ["Artikel", "Tutorial", "Riset", "Buku", "Roadmap", "Produk", "Lainnya"],
    },
    title: { type: String, default: "" },
    createdAt: { type: Number, default: () => Date.now() },
  },
  { versionKey: false }
);

export const MessageModel =
  (models.Message as mongoose.Model<IMessage>) || model<IMessage>("Message", MessageSchema);
