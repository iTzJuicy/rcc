import Category from "../models/Category.js";
import { pickFields } from "../utils/pickFields.js";
import Project from "../models/Project.js";

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export async function getCategories(req, res, next) {
  try {
    const { type, activeOnly } = req.query;
    const filter = type ? { type } : {};
    let categories = await Category.find(filter).sort({ order: 1, name: 1 });

    if (activeOnly === "true") {
      // Find distinct categories actually used by projects
      const distinctProjectCategories = await Project.distinct("category");
      const normalizedProjectCats = distinctProjectCategories.map((c) =>
        (c || "").trim().toLowerCase()
      );

      categories = categories.filter((cat) =>
        normalizedProjectCats.includes((cat.name || "").trim().toLowerCase())
      );
    }

    res.json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    next(error);
  }
}

export const adminGetCategories = getCategories;

export async function adminCreateCategory(req, res, next) {
  try {
    const { name, slug, type, description, order } = req.body;
    const finalSlug = slug ? slugify(slug) : slugify(name);

    const category = await Category.create({
      name,
      slug: finalSlug,
      type: type || "project",
      description: description || "",
      order: Number(order) || 0,
    });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const updates = pickFields(req.body, ["name", "slug", "type", "description", "order"]);
    if (updates.slug) updates.slug = slugify(updates.slug);

    const category = await Category.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.json({ success: true, message: "Category deleted successfully." });
  } catch (error) {
    next(error);
  }
}

export default {
  getCategories,
  adminGetCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
};
