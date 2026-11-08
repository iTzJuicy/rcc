import Testimonial from "../models/Testimonial.js";
import { pickFields } from "../utils/pickFields.js";

export async function getPublicTestimonials(req, res, next) {
  try {
    const testimonials = await Testimonial.find({ isApproved: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    next(error);
  }
}

export async function adminGetTestimonials(req, res, next) {
  try {
    const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    next(error);
  }
}

export async function adminCreateTestimonial(req, res, next) {
  try {
    const { name, location, role, rating, text, photo, isApproved, order } = req.body;

    const testimonial = await Testimonial.create({
      name,
      location: location || "Mangalore",
      role: role || "Client",
      rating: Number(rating) || 5,
      text,
      quote: text,
      photo: photo || "",
      isApproved: isApproved ?? true,
      order: Number(order) || 0,
    });

    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateTestimonial(req, res, next) {
  try {
    const { id } = req.params;
    const updates = pickFields(req.body, [
      "name", "location", "role", "rating", "text", "quote", "photo",
      "isApproved", "order",
    ]);
    if (updates.text && !updates.quote) updates.quote = updates.text;

    const testimonial = await Testimonial.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }

    res.json({ success: true, data: testimonial });
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteTestimonial(req, res, next) {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }

    res.json({ success: true, message: "Testimonial deleted successfully." });
  } catch (error) {
    next(error);
  }
}

export async function adminReorderTestimonials(req, res, next) {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, message: "orderedIds array is required" });
    }

    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { order: index },
      },
    }));

    await Testimonial.bulkWrite(bulkOps);

    res.json({ success: true, message: "Testimonials reordered successfully." });
  } catch (error) {
    next(error);
  }
}

export default {
  getPublicTestimonials,
  adminGetTestimonials,
  adminCreateTestimonial,
  adminUpdateTestimonial,
  adminDeleteTestimonial,
  adminReorderTestimonials,
};
