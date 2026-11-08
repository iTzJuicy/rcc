import Media from "../models/Media.js";
import { processUpload } from "../middleware/upload.js";
import { cloudinary, isConfigured } from "../config/cloudinary.js";
import fs from "fs";
import path from "path";

export async function adminGetMedia(req, res, next) {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.json({ success: true, count: media.length, data: media });
  } catch (error) {
    next(error);
  }
}

export async function adminUploadMedia(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided." });
    }

    const { title, altText } = req.body;

    const result = await processUpload(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    const mediaDoc = await Media.create({
      url: result.url,
      public_id: result.public_id,
      filename: req.file.originalname,
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
      title: title || req.file.originalname,
      altText: altText || title || req.file.originalname,
    });

    res.status(201).json({ success: true, data: mediaDoc });
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteMedia(req, res, next) {
  try {
    const { id } = req.params;
    const item = await Media.findById(id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Media item not found." });
    }

    // Attempt removal from Cloudinary if configured
    if (isConfigured && item.public_id && !item.url.startsWith("/uploads/")) {
      try {
        await cloudinary.uploader.destroy(item.public_id);
      } catch (err) {
        console.warn("Cloudinary delete warning:", err.message);
      }
    } else if (item.url.startsWith("/uploads/")) {
      // Local file removal
      const localPath = path.resolve("public", item.url.replace(/^\//, ""));
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      }
    }

    await Media.findByIdAndDelete(id);

    res.json({ success: true, message: "Media file deleted successfully." });
  } catch (error) {
    next(error);
  }
}

export default { adminGetMedia, adminUploadMedia, adminDeleteMedia };
