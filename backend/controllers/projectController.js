import Project from "../models/Project.js";
import { pickFields, pickSeo } from "../utils/pickFields.js";
import { normalizeMediaDocument, normalizeMediaDocuments } from "../utils/mediaUrl.js";

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export async function getPublicProjects(req, res, next) {
  try {
    const { category, status, search, page = 1, limit = 12 } = req.query;

    const filter = {};

    if (category && category !== "All") {
      filter.category = new RegExp(`^${category.trim()}$`, "i");
    }

    if (status && status !== "All") {
      filter.status = new RegExp(`^${status.trim()}$`, "i");
    }

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * pageSize;

    const total = await Project.countDocuments(filter);
    const projects = await Project.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.json({
      success: true,
      data: normalizeMediaDocuments(projects),
      total,
      page: pageNum,
      pages: Math.ceil(total / pageSize) || 1,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPublicProjectBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const project = await Project.findOne({
      $or: [{ slug }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : null }],
    });

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.json({ success: true, data: normalizeMediaDocument(project) });
  } catch (error) {
    next(error);
  }
}

export async function adminGetProjects(req, res, next) {
  try {
    const { category, status, search, page, limit } = req.query;
    const filter = {};

    if (category && category !== "All") {
      filter.category = new RegExp(`^${category.trim()}$`, "i");
    }

    if (status && status !== "All") {
      filter.status = new RegExp(`^${status.trim()}$`, "i");
    }

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
      ];
    }

    const total = await Project.countDocuments(filter);

    let query = Project.find(filter).sort({ order: 1, createdAt: -1 });

    if (page && limit) {
      const pageNum = Math.max(1, parseInt(page, 10));
      const pageSize = Math.max(1, parseInt(limit, 10));
      query = query.skip((pageNum - 1) * pageSize).limit(pageSize);
      const projects = await query;
      return res.json({
        success: true,
        count: projects.length,
        total,
        page: pageNum,
        pages: Math.ceil(total / pageSize) || 1,
        data: normalizeMediaDocuments(projects),
      });
    }

    const projects = await query;
    res.json({ success: true, count: projects.length, total, data: normalizeMediaDocuments(projects) });
  } catch (error) {
    next(error);
  }
}

export async function adminCreateProject(req, res, next) {
  try {
    const {
      title,
      slug,
      category,
      status,
      location,
      year,
      area,
      client,
      description,
      fullDescription,
      coverImage,
      gallery,
      isFeatured,
      order,
      seo,
    } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Project title is required." });
    }
    if (title.length > 60) {
      return res.status(400).json({ success: false, message: `Project title cannot exceed 60 characters (currently ${title.length})` });
    }
    if (description && description.length > 160) {
      return res.status(400).json({ success: false, message: `Short description cannot exceed 160 characters (currently ${description.length})` });
    }
    if (fullDescription && fullDescription.length > 1200) {
      return res.status(400).json({ success: false, message: `Full description cannot exceed 1200 characters (currently ${fullDescription.length})` });
    }
    if (Array.isArray(gallery) && gallery.length > 12) {
      return res.status(400).json({ success: false, message: `Gallery cannot exceed 12 images (currently ${gallery.length})` });
    }

    const finalSlug = slug ? slugify(slug) : slugify(title);

    const newProject = await Project.create({
      title: title.trim(),
      slug: finalSlug,
      category: category || "Residential",
      status: status || "Completed",
      location: location || "Mangalore, Karnataka",
      year: year || "",
      area: area || "",
      client: client || "",
      description: description || "",
      fullDescription: fullDescription || "",
      coverImage: coverImage || "/images/card1.webp",
      image: coverImage || "/images/card1.webp",
      gallery: Array.isArray(gallery) ? gallery : [],
      isFeatured: Boolean(isFeatured),
      order: Number(order) || 0,
      seo: seo || {},
    });

    res.status(201).json({ success: true, data: newProject });
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateProject(req, res, next) {
  try {
    const { id } = req.params;
    const updates = pickFields(req.body, [
      "title", "slug", "category", "status", "location", "year", "area",
      "client", "description", "fullDescription", "coverImage", "image",
      "gallery", "isFeatured", "order",
    ]);
    if (Object.prototype.hasOwnProperty.call(req.body, "seo")) {
      updates.seo = pickSeo(req.body.seo);
    }

    if (updates.title) {
      if (updates.title.trim().length === 0) {
        return res.status(400).json({ success: false, message: "Project title cannot be empty." });
      }
      if (updates.title.length > 60) {
        return res.status(400).json({ success: false, message: `Project title cannot exceed 60 characters (currently ${updates.title.length})` });
      }
      updates.title = updates.title.trim();
    }

    if (updates.description && updates.description.length > 160) {
      return res.status(400).json({ success: false, message: `Short description cannot exceed 160 characters (currently ${updates.description.length})` });
    }

    if (updates.fullDescription && updates.fullDescription.length > 1200) {
      return res.status(400).json({ success: false, message: `Full description cannot exceed 1200 characters (currently ${updates.fullDescription.length})` });
    }

    if (Array.isArray(updates.gallery) && updates.gallery.length > 12) {
      return res.status(400).json({ success: false, message: `Gallery cannot exceed 12 images (currently ${updates.gallery.length})` });
    }

    if (updates.slug) {
      updates.slug = slugify(updates.slug);
    }
    if (updates.coverImage) {
      updates.image = updates.coverImage;
    }

    const project = await Project.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.json({ success: true, data: normalizeMediaDocument(project) });
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteProject(req, res, next) {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.json({ success: true, message: "Project deleted successfully." });
  } catch (error) {
    next(error);
  }
}

export async function adminReorderProjects(req, res, next) {
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

    await Project.bulkWrite(bulkOps);

    res.json({ success: true, message: "Projects reordered successfully." });
  } catch (error) {
    next(error);
  }
}

export default {
  getPublicProjects,
  getPublicProjectBySlug,
  adminGetProjects,
  adminCreateProject,
  adminUpdateProject,
  adminDeleteProject,
  adminReorderProjects,
};
