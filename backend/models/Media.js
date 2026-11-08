import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      default: "",
    },
    filename: {
      type: String,
      default: "",
    },
    format: {
      type: String,
      default: "webp",
    },
    bytes: {
      type: Number,
      default: 0,
    },
    width: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: "",
    },
    altText: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Media || mongoose.model("Media", mediaSchema);
