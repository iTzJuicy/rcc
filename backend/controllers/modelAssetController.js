import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import ModelAsset from "../models/ModelAsset.js";
import Project from "../models/Project.js";
import { cloudinary, isConfigured } from "../config/cloudinary.js";

const MODEL_DIRECTORY = path.resolve("public/uploads/models");

function getDisplayFilename(storedFilename) {
  return storedFilename.replace(/^[0-9a-f-]{36}-/i, "");
}

async function saveAsset(asset) {
  try {
    return await ModelAsset.findOneAndUpdate(
      { url: asset.url },
      { $setOnInsert: asset },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
  } catch (error) {
    if (error.code !== 11000) throw error;
    const existing = await ModelAsset.findOne({ url: asset.url });
    if (!existing) throw error;
    return existing;
  }
}

export async function adminGetModelAssets(req, res, next) {
  try {
    const localFiles = await fs.promises.readdir(MODEL_DIRECTORY, { withFileTypes: true });
    const assets = [];

    for (const file of localFiles) {
      if (!file.isFile() || ![".glb", ".gltf"].includes(path.extname(file.name).toLowerCase())) continue;
      const filePath = path.join(MODEL_DIRECTORY, file.name);
      const stat = await fs.promises.stat(filePath);
      assets.push(await saveAsset({
        url: `/uploads/models/${encodeURIComponent(file.name)}`,
        filename: getDisplayFilename(file.name),
        storage: "local",
        bytes: stat.size,
      }));
    }

    if (isConfigured) {
      let nextCursor;
      do {
        const result = await cloudinary.api.resources({
          resource_type: "raw",
          type: "upload",
          prefix: "rcc_infrastructure/models/",
          max_results: 500,
          ...(nextCursor ? { next_cursor: nextCursor } : {}),
        });

        for (const resource of result.resources || []) {
          const extension = path.extname(resource.public_id).toLowerCase() || `.${resource.format || ""}`;
          if (![".glb", ".gltf"].includes(extension)) continue;
          const filename = resource.original_filename || path.basename(resource.public_id);
          assets.push(await saveAsset({
            url: resource.secure_url,
            filename: path.extname(filename) ? filename : `${filename}${extension}`,
            public_id: resource.public_id,
            storage: "cloudinary",
            bytes: resource.bytes || 0,
          }));
        }
        nextCursor = result.next_cursor;
      } while (nextCursor);
    }

    const gridfsAssets = await ModelAsset.find({ storage: "gridfs" });
    assets.push(...gridfsAssets);

    const uniqueAssets = [...new Map(assets.map((asset) => [asset.url, asset])).values()]
      .sort((a, b) => a.filename.localeCompare(b.filename));
    res.json({ success: true, count: uniqueAssets.length, data: uniqueAssets });
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteModelAsset(req, res, next) {
  try {
    const asset = await ModelAsset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ success: false, message: "3D model was not found." });
    }

    const linkedProject = await Project.findOne({ model3dUrl: asset.url }).select("title");
    if (linkedProject) {
      return res.status(409).json({
        success: false,
        message: `This model is assigned to "${linkedProject.title}". Remove it from that project before deleting it.`,
      });
    }

    if (asset.storage === "local") {
      const assetUrl = new URL(asset.url, "http://localhost");
      if (assetUrl.origin !== "http://localhost" || !assetUrl.pathname.startsWith("/uploads/models/")) {
        return res.status(400).json({ success: false, message: "Invalid model storage path." });
      }
      const filename = decodeURIComponent(assetUrl.pathname.split("/").pop());
      const filePath = path.resolve(MODEL_DIRECTORY, filename);
      if (path.dirname(filePath) !== MODEL_DIRECTORY) {
        return res.status(400).json({ success: false, message: "Invalid model storage path." });
      }
      try {
        await fs.promises.unlink(filePath);
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
      }
    } else if (asset.storage === "gridfs") {
      if (asset.public_id && mongoose.connection.db) {
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
          bucketName: "models",
        });
        try {
          await bucket.delete(new mongoose.Types.ObjectId(asset.public_id));
        } catch (error) {
          if (!/File not found/i.test(error.message)) throw error;
        }
      }
    } else {
      const result = await cloudinary.uploader.destroy(asset.public_id, { resource_type: "raw" });
      if (!["ok", "not found"].includes(result.result)) {
        throw new Error(`Cloudinary did not delete the model (${result.result}).`);
      }
    }

    await asset.deleteOne();
    return res.json({ success: true, message: "3D model deleted from the reusable library." });
  } catch (error) {
    next(error);
  }
}
