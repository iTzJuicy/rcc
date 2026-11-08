import mongoose from "mongoose";

const statSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: [true, "Stat value is required"],
      trim: true,
    },
    suffix: {
      type: String,
      default: "",
      trim: true,
    },
    label: {
      type: String,
      required: [true, "Stat label is required"],
      trim: true,
    },
    icon: {
      type: String,
      default: "shield",
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Stat || mongoose.model("Stat", statSchema);
