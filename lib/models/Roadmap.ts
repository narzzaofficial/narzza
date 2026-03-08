import mongoose, { Schema, model, models } from "mongoose";

interface IRoadmapVideo {
  id: string;
  title: string; // ← tambah field title
  author: string;
}

interface IRoadmapStep {
  title: string;
  description: string;
  focus: string;
  videos: IRoadmapVideo[];
}

export interface IRoadmap {
  slug: string;
  title: string;
  summary: string;
  duration: string;
  level: "Pemula" | "Menengah" | "Lanjutan";
  tags: string[];
  image: string;
  steps: IRoadmapStep[];
  createdAt?: number;
  updatedAt?: number;
}

const RoadmapVideoSchema = new Schema<IRoadmapVideo>(
  {
    id: { type: String, default: "" },
    title: { type: String, default: "" }, // ← tambah field title
    author: { type: String, default: "" },
  },
  { _id: false }
);

const RoadmapStepSchema = new Schema<IRoadmapStep>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    focus: { type: String, default: "" },
    videos: { type: [RoadmapVideoSchema], default: [] },
  },
  { _id: false }
);

const RoadmapSchema = new Schema<IRoadmap>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    summary: { type: String, default: "" },
    duration: { type: String, default: "" },
    level: {
      type: String,
      enum: ["Pemula", "Menengah", "Lanjutan"],
      default: "Pemula",
    },
    tags: { type: [String], default: [] },
    image: { type: String, default: "" },
    steps: { type: [RoadmapStepSchema], default: [] },
    createdAt: { type: Number, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() },
  },
  { versionKey: false }
);

RoadmapSchema.index(
  { title: "text", summary: "text", tags: "text" },
  {
    weights: { title: 10, tags: 6, summary: 2 },
    default_language: "none",
    name: "roadmap_text_idx",
  }
);

export const RoadmapModel =
  (models.Roadmap as mongoose.Model<IRoadmap>) ||
  model<IRoadmap>("Roadmap", RoadmapSchema);
