import Stat from "../models/Stat.js";

export async function getPublicStats(req, res, next) {
  try {
    const stats = await Stat.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, count: stats.length, data: stats });
  } catch (error) {
    next(error);
  }
}

export async function adminGetStats(req, res, next) {
  try {
    const stats = await Stat.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, count: stats.length, data: stats });
  } catch (error) {
    next(error);
  }
}

export async function adminCreateStat(req, res, next) {
  try {
    const { value, suffix, label, icon, order } = req.body;

    const stat = await Stat.create({
      value,
      suffix: suffix || "",
      label,
      icon: icon || "shield",
      order: Number(order) || 0,
    });

    res.status(201).json({ success: true, data: stat });
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateStat(req, res, next) {
  try {
    const { id } = req.params;
    const stat = await Stat.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!stat) {
      return res.status(404).json({ success: false, message: "Stat item not found" });
    }

    res.json({ success: true, data: stat });
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteStat(req, res, next) {
  try {
    const { id } = req.params;
    const stat = await Stat.findByIdAndDelete(id);

    if (!stat) {
      return res.status(404).json({ success: false, message: "Stat item not found" });
    }

    res.json({ success: true, message: "Stat item deleted successfully." });
  } catch (error) {
    next(error);
  }
}

export async function adminReorderStats(req, res, next) {
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

    await Stat.bulkWrite(bulkOps);

    res.json({ success: true, message: "Stats reordered successfully." });
  } catch (error) {
    next(error);
  }
}

export default {
  getPublicStats,
  adminGetStats,
  adminCreateStat,
  adminUpdateStat,
  adminDeleteStat,
  adminReorderStats,
};
