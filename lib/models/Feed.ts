import mongoose, { Schema, model, models } from "mongoose";

export interface IChatLine {
  role: "q" | "a";
  text: string;
  image?: string;
}

export interface IFeed {
  id: number;
  slug: string;
  title: string;
  category: "Berita" | "Tutorial" | "Riset";
  createdAt: number;
  popularity: number;
  image: string;
  lines: IChatLine[];
  // ─── Field baru ───────────────────────────────────────────────────────────
  lineCount: number; // jumlah pertanyaan (role:"q") — untuk "X langkah"
  previewLines: IChatLine[]; // 2 lines pertama — untuk preview Q&A di card
  // ──────────────────────────────────────────────────────────────────────────
  takeaway: string;
  author?: string;
  source?: { title: string; url: string };
  storyId?: number | null;
}

const ChatLineSchema = new Schema<IChatLine>(
  {
    role: { type: String, enum: ["q", "a"], required: true },
    text: { type: String, required: true },
    image: { type: String },
  },
  { _id: false }
);

const FeedSchema = new Schema<IFeed>(
  {
    id: { type: Number, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ["Berita", "Tutorial", "Riset"],
      required: true,
    },
    createdAt: { type: Number, default: Date.now },
    popularity: { type: Number, default: 0 },
    image: { type: String, default: "" },
    lines: { type: [ChatLineSchema], default: [] },
    lineCount: { type: Number, default: 0 },
    previewLines: { type: [ChatLineSchema], default: [] },
    takeaway: { type: String, default: "" },
    author: { type: String, default: "" },
    source: {
      type: new Schema({ title: String, url: String }, { _id: false }),
      default: undefined,
    },
    storyId: { type: Number, default: null },
  },
  { versionKey: false }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

FeedSchema.index({ createdAt: -1 });
FeedSchema.index({ category: 1, createdAt: -1 });
FeedSchema.index({ category: 1, popularity: -1 });
FeedSchema.index({ popularity: -1 });

FeedSchema.index(
  { title: "text", takeaway: "text", "lines.text": "text" },
  {
    weights: { title: 10, takeaway: 5, "lines.text": 1 },
    default_language: "none",
    name: "feed_text_idx",
  }
);

export const FeedModel =
  (models.Feed as mongoose.Model<IFeed>) || model<IFeed>("Feed", FeedSchema);
