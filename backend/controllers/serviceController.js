import Service from "../models/Service.js";
import { pickFields, pickSeo } from "../utils/pickFields.js";
import { normalizeMediaDocument, normalizeMediaDocuments } from "../utils/mediaUrl.js";

// Helper to generate a clean URL slug from title
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export async function getPublicServices(req, res, next) {
  try {
    const { homeOnly } = req.query;
    let query = { isActive: true };
    if (homeOnly === "true") {
      query.showOnHome = true;
    }

    let services = await Service.find(query).sort({ order: 1, createdAt: 1 });

    if (homeOnly === "true") {
      services = services.slice(0, 4);
    }

    res.json({ success: true, count: services.length, data: normalizeMediaDocuments(services) });
  } catch (error) {
    next(error);
  }
}

export async function getPublicServiceBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const service = await Service.findOne({
      $or: [{ slug }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : null }],
      isActive: true,
    });

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found." });
    }

    res.json({ success: true, data: normalizeMediaDocument(service) });
  } catch (error) {
    next(error);
  }
}

export async function adminGetServices(req, res, next) {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: services.length, data: normalizeMediaDocuments(services) });
  } catch (error) {
    next(error);
  }
}

export async function adminCreateService(req, res, next) {
  try {
    const { title, slug, shortDescription, longDescription, image, icon, gallery, order, showOnHome, isActive, seo } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Service title is required." });
    }
    if (title.length > 60) {
      return res.status(400).json({ success: false, message: `Service title cannot exceed 60 characters (currently ${title.length})` });
    }
    if (shortDescription && shortDescription.length > 160) {
      return res.status(400).json({ success: false, message: `Short description cannot exceed 160 characters (currently ${shortDescription.length})` });
    }
    if (longDescription && longDescription.length > 1200) {
      return res.status(400).json({ success: false, message: `Long description cannot exceed 1200 characters (currently ${longDescription.length})` });
    }
    if (Array.isArray(gallery) && gallery.length > 10) {
      return res.status(400).json({ success: false, message: `Gallery cannot exceed 10 images (currently ${gallery.length})` });
    }

    const finalSlug = slug ? slugify(slug) : slugify(title);

    const newService = await Service.create({
      title: title.trim(),
      slug: finalSlug,
      shortDescription: shortDescription?.trim() || "",
      longDescription: longDescription?.trim() || "",
      description: shortDescription?.trim() || longDescription?.trim() || "",
      image: image || "/images/impact.webp",
      icon: icon || "building",
      gallery: Array.isArray(gallery) ? gallery : [],
      order: Number(order) || 0,
      showOnHome: showOnHome ?? true,
      isActive: isActive ?? true,
      seo: seo || {},
    });

    res.status(201).json({ success: true, data: normalizeMediaDocument(newService) });
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateService(req, res, next) {
  try {
    const { id } = req.params;
    const updates = pickFields(req.body, [
      "title", "slug", "shortDescription", "longDescription", "description",
      "image", "icon", "gallery", "order", "showOnHome", "isActive",
    ]);
    if (Object.prototype.hasOwnProperty.call(req.body, "seo")) {
      updates.seo = pickSeo(req.body.seo);
    }

    if (updates.title) {
      if (updates.title.trim().length === 0) {
        return res.status(400).json({ success: false, message: "Service title cannot be empty." });
      }
      if (updates.title.length > 60) {
        return res.status(400).json({ success: false, message: `Service title cannot exceed 60 characters (currently ${updates.title.length})` });
      }
      updates.title = updates.title.trim();
    }

    if (updates.shortDescription && updates.shortDescription.length > 160) {
      return res.status(400).json({ success: false, message: `Short description cannot exceed 160 characters (currently ${updates.shortDescription.length})` });
    }

    if (updates.longDescription && updates.longDescription.length > 1200) {
      return res.status(400).json({ success: false, message: `Long description cannot exceed 1200 characters (currently ${updates.longDescription.length})` });
    }

    if (Array.isArray(updates.gallery) && updates.gallery.length > 10) {
      return res.status(400).json({ success: false, message: `Gallery cannot exceed 10 images (currently ${updates.gallery.length})` });
    }

    if (updates.slug) {
      updates.slug = slugify(updates.slug);
    }

    if (updates.shortDescription && !updates.description) {
      updates.description = updates.shortDescription;
    }

    const service = await Service.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    res.json({ success: true, data: normalizeMediaDocument(service) });
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteService(req, res, next) {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    res.json({ success: true, message: "Service deleted successfully." });
  } catch (error) {
    next(error);
  }
}

export async function adminReorderServices(req, res, next) {
  try {
    const { orderedIds } = req.body; // Array of service IDs in desired order

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, message: "orderedIds array is required" });
    }

    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { order: index },
      },
    }));

    await Service.bulkWrite(bulkOps);

    res.json({ success: true, message: "Services reordered successfully." });
  } catch (error) {
    next(error);
  }
}

export default {
  getPublicServices,
  getPublicServiceBySlug,
  adminGetServices,
  adminCreateService,
  adminUpdateService,
  adminDeleteService,
  adminReorderServices,
};
