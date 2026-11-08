import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { cloudinary, isConfigured } from "../config/cloudinary.js";

// Local storage fallback directory
const uploadDir = path.resolve("public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const MIME_MAP = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  // SVG disallowed to prevent stored XSS attacks
  if (MIME_MAP[file.mimetype]) {
    cb(null, true);
  } else {
    const error = new Error(
      "Invalid file format. Only JPEG, PNG, WebP, and AVIF images are permitted."
    );
    error.status = 400;
    cb(error, false);
  }
}

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter,
});

async function saveLocalUpload(fileBuffer, safeExt, sanitizedTitle) {
  const uniqueName = `${crypto.randomUUID()}.${safeExt}`;
  const localPath = path.join(uploadDir, uniqueName);

  await fs.promises.writeFile(localPath, fileBuffer);

  return {
    url: `/uploads/${uniqueName}`,
    public_id: uniqueName,
    filename: `${sanitizedTitle}.${safeExt}`,
    format: safeExt,
    bytes: fileBuffer.length,
    width: 0,
    height: 0,
  };
}

function uploadToCloudinary(fileBuffer, sanitizedTitle) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "rcc_infrastructure",
        format: "webp",
        resource_type: "image",
        transformation: [{ quality: "auto:good" }, { fetch_format: "auto" }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          filename: `${sanitizedTitle}.webp`,
          format: "webp",
          bytes: result.bytes,
          width: result.width,
          height: result.height,
        });
      }
    );
    uploadStream.end(fileBuffer);
  });
}

/**
 * Safe upload processor that uploads to Cloudinary or generates a safe random filename locally
 */
export async function processUpload(fileBuffer, originalName, mimeType) {
  const safeExt = MIME_MAP[mimeType] || "webp";
  const sanitizedTitle = path.basename(originalName, path.extname(originalName))
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 50);

  if (isConfigured) {
    try {
      return await uploadToCloudinary(fileBuffer, sanitizedTitle);
    } catch (error) {
      console.warn(`[Storage] Cloudinary upload failed (${error.http_code || error.message}); retrying once.`);
      try {
        return await uploadToCloudinary(fileBuffer, sanitizedTitle);
      } catch (retryError) {
        console.warn(
          `[Storage] Cloudinary retry failed (${retryError.http_code || retryError.message}); using local upload fallback.`
        );
      }
    }
  }

  // Safe local fallback (random UUID, strict safe extension)
  return saveLocalUpload(fileBuffer, safeExt, sanitizedTitle);
}

export default upload;
