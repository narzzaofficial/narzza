import mongoose, { Schema, model, models } from "mongoose";

export interface IChatLine {
  role: "q" | "a";
  text: string;
  image?: string;
}

export interface IBookChapter {
  title: string;
  lines: IChatLine[];
}

export interface IBook {
  id: number;
  title: string;
  author: string;
  cover: string;
  genre: string;
  pages: number;
  rating: number;
  description: string;
  chapters: IBookChapter[];
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

const BookChapterSchema = new Schema<IBookChapter>(
  {
    title: { type: String, required: true },
    lines: { type: [ChatLineSchema], default: [] },
  },
  { _id: false }
);

const BookSchema = new Schema<IBook>(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    cover: { type: String, default: "" },
    genre: { type: String, default: "" },
    pages: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    description: { type: String, default: "" },
    chapters: { type: [BookChapterSchema], default: [] },
    storyId: { type: Number, default: null },
  },
  { versionKey: false }
);

// Text index for fast full-text search
BookSchema.index(
  { title: "text", author: "text", genre: "text", description: "text" },
  { weights: { title: 10, author: 7, genre: 4, description: 1 }, default_language: "none", name: "book_text_idx" }
);

export const BookModel = (models.Book as mongoose.Model<IBook>) || model<IBook>("Book", BookSchema);
