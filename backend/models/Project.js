import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      index: true,
    },
    status: {
      type: String,
      enum: ["Completed", "Ongoing", "Upcoming", "Planned"],
      default: "Completed",
      index: true,
    },
    location: {
      type: String,
      default: "Mangalore, Karnataka",
      trim: true,
    },
    mapUrl: {
      type: String,
      default: "",
      trim: true,
    },
    area: {
      type: String,
      default: "",
    },
    client: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
    },
    fullDescription: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "/images/card1.webp",
    },
    bannerImage: {
      type: String,
      default: "",
    },
    gallery: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    showQuotationButton: {
      type: Boolean,
      default: true,
    },
    model3dUrl: {
      type: String,
      default: "",
    },
    model3dTemplate: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      ogImage: { type: String, default: "" },
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

projectSchema.pre("init", function (document) {
  if (!document.coverImage && document.image) {
    document.coverImage = document.image;
  }
  delete document.image;
});

projectSchema.virtual("image")
  .get(function () {
    return this.coverImage;
  })
  .set(function (value) {
    this.coverImage = value;
  });

projectSchema.index({ title: "text", description: "text", location: "text", category: "text" });

export default mongoose.models.Project || mongoose.model("Project", projectSchema);
