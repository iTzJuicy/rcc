import mongoose from "mongoose";

const modelAssetSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      unique: true,
    },
    filename: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      default: "",
    },
    storage: {
      type: String,
      enum: ["local", "cloudinary", "gridfs"],
      required: true,
    },
    bytes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.ModelAsset || mongoose.model("ModelAsset", modelAssetSchema);
