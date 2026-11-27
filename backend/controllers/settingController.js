import SiteSetting from "../models/SiteSetting.js";
import { pickFields, pickSeo } from "../utils/pickFields.js";

const SETTING_FIELDS = [
  "siteName", "tagline", "logo", "favicon", "phone", "email", "address",
  "mapEmbedUrl", "heroHeadline", "heroSubtext", "heroButtonLabel",
  "contactCtaTitle", "contactCtaDescription",
];

function getSettingsUpdates(body) {
  const updates = pickFields(body, SETTING_FIELDS);
  if (body.socialLinks && typeof body.socialLinks === "object" && !Array.isArray(body.socialLinks)) {
    updates.socialLinks = pickFields(body.socialLinks, ["facebook", "instagram", "linkedin", "whatsapp"]);
  }
  if (body.defaultSeo && typeof body.defaultSeo === "object" && !Array.isArray(body.defaultSeo)) {
    updates.defaultSeo = pickSeo(body.defaultSeo);
  }
  return updates;
}

async function getSingletonSettings(updates = {}) {
  let settings = await SiteSetting.findOne({ singleton: true });

  if (!settings) {
    try {
      settings = await SiteSetting.findOneAndUpdate(
        { singleton: { $exists: false } },
        { $set: { singleton: true } },
        { new: true, sort: { createdAt: 1 } }
      );

      if (!settings) {
        settings = await SiteSetting.findOneAndUpdate(
          { singleton: true },
          { $setOnInsert: { singleton: true } },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );
      }
    } catch (error) {
      if (error.code !== 11000) throw error;
      settings = await SiteSetting.findOne({ singleton: true });
      if (!settings) throw error;
    }
  }

  if (Object.keys(updates).length) {
    settings = await SiteSetting.findByIdAndUpdate(settings._id, updates, {
      new: true,
      runValidators: true,
    });
  }

  return settings;
}

export async function getPublicSettings(req, res, next) {
  try {
    const settings = await getSingletonSettings();
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
}

export async function adminGetSettings(req, res, next) {
  try {
    const settings = await getSingletonSettings();
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateSettings(req, res, next) {
  try {
    const updates = getSettingsUpdates(req.body);
    const settings = await getSingletonSettings(updates);
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
}

export default { getPublicSettings, adminGetSettings, adminUpdateSettings };
