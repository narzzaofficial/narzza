import mongoose, { Schema, model, models } from "mongoose";

export interface IComment {
  feedId: number;
  author: string;
  text: string;
  createdAt: number;
}

const CommentSchema = new Schema<IComment>(
  {
    feedId: { type: Number, required: true, index: true },
    author: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Number, default: () => Date.now() },
  },
  { versionKey: false }
);

export const CommentModel =
  (models.Comment as mongoose.Model<IComment>) || model<IComment>("Comment", CommentSchema);
