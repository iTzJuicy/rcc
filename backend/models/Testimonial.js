import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },
    location: {
      type: String,
      default: "Mangalore",
      trim: true,
    },
    role: {
      type: String,
      default: "Client",
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    text: {
      type: String,
      required: [true, "Testimonial text is required"],
      trim: true,
    },
    quote: {
      type: String,
      trim: true,
    },
    photo: {
      type: String,
      default: "",
    },
    isApproved: {
      type: Boolean,
      default: true,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Testimonial || mongoose.model("Testimonial", testimonialSchema);
