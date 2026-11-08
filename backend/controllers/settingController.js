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

export async function getPublicSettings(req, res, next) {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = await SiteSetting.create({});
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
}

export async function adminGetSettings(req, res, next) {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = await SiteSetting.create({});
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateSettings(req, res, next) {
  try {
    const updates = getSettingsUpdates(req.body);
    let settings = await SiteSetting.findOne();

    if (!settings) {
      settings = await SiteSetting.create(updates);
    } else {
      settings = await SiteSetting.findByIdAndUpdate(settings._id, updates, {
        new: true,
        runValidators: true,
      });
    }

    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
}

export default { getPublicSettings, adminGetSettings, adminUpdateSettings };
