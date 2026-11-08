import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phone: {
      type: String,
      default: "",
      trim: true,
      maxlength: [30, "Phone cannot exceed 30 characters"],
    },
    subject: {
      type: String,
      default: "General Website Enquiry",
      trim: true,
      maxlength: [150, "Subject cannot exceed 150 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [4000, "Message cannot exceed 4000 characters"],
    },
    projectTitle: {
      type: String,
      default: "",
      trim: true,
    },
    projectSlug: {
      type: String,
      default: "",
      trim: true,
    },
    budget: {
      type: String,
      default: "",
      trim: true,
    },
    timeline: {
      type: String,
      default: "",
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    carpetArea: {
      type: String,
      default: "",
      trim: true,
    },
    projectType: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "in_progress", "closed", "archived"],
      default: "new",
      index: true,
    },
    notes: {
      type: String,
      default: "",
    },
    ipAddress: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Enquiry || mongoose.model("Enquiry", enquirySchema);
