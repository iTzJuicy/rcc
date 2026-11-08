import mongoose from "mongoose";

const contentBlockSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, "Content key is required"],
      unique: true,
      trim: true,
      index: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.models.ContentBlock ||
  mongoose.model("ContentBlock", contentBlockSchema);
