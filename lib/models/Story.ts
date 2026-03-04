import mongoose, { Schema, model, models } from "mongoose";

export interface IStory {
  id: number;
  name: string;
  label: string;
  type: "Berita" | "Tutorial" | "Riset";
  palette: string;
  image: string;
  viral: boolean;
}

const StorySchema = new Schema<IStory>(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, enum: ["Berita", "Tutorial", "Riset"], required: true },
    palette: { type: String, required: true },
    image: { type: String, default: "" },
    viral: { type: Boolean, default: false },
  },
  { versionKey: false }
);

export const StoryModel = (models.Story as mongoose.Model<IStory>) || model<IStory>("Story", StorySchema);
